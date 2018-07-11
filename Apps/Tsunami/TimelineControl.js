export default class TimelineControl {
  constructor(viewer) {
    this.viewer = viewer;
    
    this.multiplier = 2;
    this.animationLength = 400;
    this.currentYear = 0;

    const time = Cesium.JulianDate.fromIso8601('0001-01-01T00:00:00Z');
    this.setTime(time);

    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.stopTime = Cesium.JulianDate.addSeconds(time, this.animationLength, new Cesium.JulianDate());
    viewer.clock.clockStep = Cesium.ClockStep.TICK_DEPENDENT;
    viewer.clock.multiplier = this.multiplier;
    viewer.timeline.updateFromClock();
    viewer.timeline.zoomTo(time, viewer.clock.stopTime);
  }

  setTime(time) {
    this.viewer.clock.startTime = time;
    this.viewer.clock.currentTime = time;
    this.viewer.clock.stopTime = Cesium.JulianDate.addSeconds(time, this.animationLength, new Cesium.JulianDate());
  }

  getCurrentYear() {
    return Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getUTCFullYear();
  }

  setYearChangeCallback(callback) {
    this.viewer.clock.onTick.addEventListener(() => {
      const newCurrentYear = this.getCurrentYear();
      if (this.currentYear !== newCurrentYear) {
        this.currentYear = newCurrentYear;
        callback(newCurrentYear);
      }
    });
  }
}