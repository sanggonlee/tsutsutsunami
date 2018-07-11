import { readTextFile } from './util.js';
//var readTextFile = require('./util').readTextFile;
var viewer = new Cesium.Viewer('cesiumContainer');



const sourceData = {
  id: 53,
  year: 684,
  magnitude: 8.4,
  //country: 'JAPAN',
  latitude: 32.5,
  longitude: 134 
};

const waveData = {
  sourceId: 53,
  id: 35,
  country: 'JAPAN',
  latitude: 33.51,
  longitude: 133.44,
  distance: 124,
  maximumHeight: null
};

const normalizeSource = row => ({
  id: row[0],
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

const sources = [];

console.log('asd');
loadSources();
//loadWaves();

function loadSources() {
  return readTextFile('./data/sources.csv')
    .then(sourceRawData => {
      sourceRawData.toString().split('\n').forEach(line => {
        const entries = line.split(',');
        sources.push(normalizeSource(entries));
      });

      sources.filter(s => !isNaN(s.latitude) && !isNaN(s.longitude)).forEach((source, i) => {
        if (i === 0) {
          return;
        }
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(source.longitude, source.latitude),
          name: 'Source',
          ellipse: {
            semiMinorAxis: 30000,
            semiMajorAxis: 30000,
            material: Cesium.Color.RED
          }
        });
      });

      //viewer.zoomTo(viewer.entities);
  });
}

function loadWaves() {
  return readTextFile('./data/waves.csv')
    .then(sourceRawData => {
      sourceRawData.toString().split('\n').forEach(line => {
        const entries = line.split(',');
        sources.push(normalizeWave(entries));
      });

      sources.filter(s => !isNaN(s.latitude) && !isNaN(s.longitude)).forEach((source, i) => {
        if (i === 0) {
          return;
        }
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(source.longitude, source.latitude),
          name: 'Source',
          ellipse: {
            semiMinorAxis: 20000,
            semiMajorAxis: 20000,
            material: Cesium.Color.BLUE
          }
        });
      });

      //viewer.zoomTo(viewer.entities);
  });
}