/**
 * @class Timer
 * Represents a timer of the movement elapse time
 */
function Timer() {
  this.startTime = null;
  this.time = 0;
  this.loopFn = null;
}

/**
 * @method
 * Start a loop to increment the timer by the INTERVAL attribute
 */
Timer.prototype.start = function () {
  var me = this,
    start = me.startTime = new Date().getTime(),
    time = me.time,
    elapsed = '0.0';

  function instance () {
    var diff;

    time += 100;
    elapsed = Math.floor(time / 100) / 10;

    me.time = elapsed;
    diff = (new Date().getTime() - start) - time;
    me.loopFn = setTimeout(instance, (100 - diff));
  }

  this.loopFn = setTimeout(instance, 100);
};

/**
 * @method
 * Stop the timer execution and returns the elapsed time
 */
Timer.prototype.stop = function () {
  clearTimeout(this.loopFn);

  return this.time;
};

/**
* @method
 * Reset the timer
 */
Timer.prototype.reset = function () {
  this.time = 0;
  this.startTime = null;
};

module.exports = Timer;
