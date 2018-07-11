export default class WaveEntity {
  constructor(viewer, data) {
    this.viewer = viewer;
    this.data = data;
    this.entitiy = null;
  }

  render() {
    const { longitude, latitude, id } = this.data;

    if (isNaN(longitude) || isNaN(latitude)) {
      return;
    }

    this.entity = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
      name: `WaveReach-${id}`,
      ellipse: {
        semiMinorAxis: 25000,
        semiMajorAxis: 25000,
        material: Cesium.Color.BLUE.withAlpha(0.5)
      }
    });
  }

  destroy() {
    if (this.entity) {
      this.viewer.entities.remove(this.entity);
    }
  }
}