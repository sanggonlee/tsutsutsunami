import { formatDate } from './util.js';

export default class WaveAnimationEntitiy {
  constructor(viewer, timeline, source, wave) {
    this.viewer = viewer;
    this.timeline = timeline;
    this.source = source;
    this.wave = wave;
    this.entity = null;
    this.property = null;
    this.timeline = timeline;
  }

  render() {
    if (!this.property) {
      this.initProperty();
    }

    this.entity = this.viewer.entities.add({
      name: `WaveAnimation-${this.source.id}-${this.wave.id}`,
      corridor: {
        positions: this.property,
        width: 40000,
        material : Cesium.Color.MEDIUMTURQUOISE.withAlpha(0.5)
      }
    });
  }

  destroy() {
    if (this.entity) {
      this.viewer.entities.remove(this.entity);
    }
  }

  initProperty() {
    const property = new Cesium.TimeIntervalCollectionProperty();

    const numFrames = this.timeline.animationLength;
    const deltaLng = (this.wave.longitude - this.source.longitude) / numFrames;
    const deltaLat = (this.wave.latitude - this.source.latitude) / numFrames;

    let currLng = this.source.longitude;
    let currLat = this.source.latitude;

    let time = Cesium.JulianDate.fromIso8601(formatDate(this.source.year));
    for (let i = 0; i < numFrames; ++i) {
      let nextTime = Cesium.JulianDate.addSeconds(time, 1, new Cesium.JulianDate());

      property.intervals.addInterval(new Cesium.TimeInterval({
        start: time,
        stop: nextTime,
        isStartIncluded : true,
        isStopIncluded : false,
        data : Cesium.Cartesian3.fromDegreesArray([
          this.source.longitude, this.source.latitude,
          currLng, currLat
        ])
      }));

      currLng += deltaLng;
      currLat += deltaLat;
      time = nextTime;
    }

    this.property = property;
  }

  computeCircle(radius) {
    var positions = [];
    for (var i = 0; i < 360; i++) {
        var radians = Cesium.Math.toRadians(i);
        positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
  }
}