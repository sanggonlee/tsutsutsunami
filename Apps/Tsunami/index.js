import TimelineControl from './TimelineControl.js';
import SourceEntity from './SourceEntity.js';
import { readTextFile, formatDate } from './util.js';

const viewer = new Cesium.Viewer('cesiumContainer');

let sources = [];
let waves = [];

const currentSourceEntities = [];

let timeline = new TimelineControl(viewer);
timeline.setYearChangeCallback((newYear) => renderObjectsForYear(newYear));

const normalizeSource = row => ({
  id: row[0],
  year: parseInt(row[1]),
  magnitude: row[9] ? parseFloat(row[9]) : 5,
  latitude: parseFloat(row[14]),
  longitude: parseFloat(row[15])
});

const normalizeWave = row => ({
  sourceId: row[0],
  id: row[1],
  latitude: parseFloat(row[9]),
  longitude: parseFloat(row[10]),
  maximumHeight: parseFloat(row[18])
});

const loadData = () => {
  return Promise.all([
    loadSources(),
    loadWaves()
  ]).then(data => {
    sources = data[0];
    waves = data[1];
  });
};

const loadSources = () => {
  return readTextFile('./data/sources.csv')
    .then(sourceRawData => {
      return sourceRawData.toString()
        .split('\n')
        .map(line => line.split(','))
        .map(normalizeSource)
        .filter(s => !isNaN(s.latitude) && !isNaN(s.longitude));
    });
}

const loadWaves = () => {
  return readTextFile('./data/waves.csv')
    .then(sourceRawData => {
      return sourceRawData.toString()
        .split('\n')
        .map(line => line.split(','))
        .map(normalizeWave)
        .filter(s => !isNaN(s.latitude) && !isNaN(s.longitude));
    });
}

const getDataByYear = year => {
  return sources
    .filter(s => s.year === year)
    .map(s => ({
      ...s,
      waves: waves.filter(w => w.sourceId === s.id)
    }));
};

const renderObjectsForYear = year => {
  currentSourceEntities.forEach(sourceEntity => sourceEntity.destroy());
  const yearData = getDataByYear(year);
  yearData.forEach(sourceData => {
    const source = new SourceEntity(viewer, timeline, sourceData);
    currentSourceEntities.push(source);
    source.render();
  });
};

const start = () => {
  loadData()
    .then(() => renderObjectsForYear(0));
};

const getTimeTravelInput = () => document.getElementById('timeTravelInput').value;

const timeTravelGotoButton = document.getElementById('timeTravelGoto');
timeTravelGotoButton.addEventListener('click', () => {
  const yearInput = getTimeTravelInput();
  if (isNaN(yearInput) || !Number.isInteger(parseInt(yearInput))) {
    return;
  }
  timeline.setTime(Cesium.JulianDate.fromIso8601(formatDate(parseInt(yearInput))));
});

const timeTravelIncrButton = document.getElementById('timeTravelIncr');
timeTravelIncrButton.addEventListener('click', () => {
  const yearInput = getTimeTravelInput();
  if (isNaN(yearInput) || !Number.isInteger(parseInt(yearInput))) {
    return;
  }
  timeline.setTime(Cesium.JulianDate.fromIso8601(formatDate(timeline.getCurrentYear() + parseInt(yearInput))));
});

start();
