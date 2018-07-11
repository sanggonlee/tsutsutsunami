import WaveEntity from './WaveEntity.js';
import WaveAnimationEntitiy from './WaveAnimationEntity.js';

const multiplier = 10000;

export default class SourceEntity {
  constructor(viewer, timeline, data) {
    this.viewer = viewer;
    this.timeline = timeline;
    this.data = data;
    this.entity = null;
    if (data.waves) {
      this.waves = data.waves.map(waveData => new WaveEntity(viewer, waveData));
      this.waveAnimations = data.waves.map(waveData => new WaveAnimationEntitiy(viewer, timeline, data, waveData));
    }
  }

  render() {
    const { longitude, latitude, magnitude, id } = this.data;

    if (isNaN(longitude) || isNaN(latitude)) {
      return;
    }

    this.entity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      name: `Source-${id}`,
      ellipsoid: {
        radii: new Cesium.Cartesian3(multiplier * magnitude, multiplier * magnitude, multiplier * magnitude),
        material: Cesium.Color.RED.withAlpha(0.5)
      }
    });

    this.waves.forEach(waveEntity => waveEntity.render());
    this.waveAnimations.forEach(waveAnimationEntity => waveAnimationEntity.render());
  }

  destroy() {
    if (this.waves) {
      this.waves.forEach(waveEntity => waveEntity.destroy());
    }
    if (this.waveAnimations) {
      this.waveAnimations.forEach(waveAnimationEntity => waveAnimationEntity.destroy());
    }
    if (this.entity) {
      this.viewer.entities.remove(this.entity);
    }
  }
}