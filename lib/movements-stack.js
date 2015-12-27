var Timer = require('./timer');
var Q = require('q');

/**
 * @class MovementsStack
 * Represents a stack of made moviments
 */
function MovementsStack() {
  this.stack = [];
  this.timer = new Timer();
  this.movimentStarted = false;
  this.currentMovimentTarget = null;
}

/**
 * @method
 * @param target {function} The function that will be stacked
 * @param oposeTargetFunction {function} The function that represents the opose operation of the target
 */
MovementsStack.prototype.startMovement = function (target, oposeTargetFunction) {

  if (!this.movimentStarted) {
    target.call(this);
    this.movimentStarted = true;
    this.currentMovimentTarget = {
      target: target,
      oposeTargetFunction: oposeTargetFunction
    };

    this.timer.start();
  }
};

/**
 * @method
 * Stop the timer of the movement
 */
MovementsStack.prototype.endMovement = function () {
  var duration = this.timer.stop();

  this.stack.push({
    target: this.currentMovimentTarget.target,
    oposeTargetFunction: this.currentMovimentTarget.oposeTargetFunction,
    duration: duration
  });

  this.timer.reset();
  this.movimentStarted = false;
};

/**
 * @method
 * Invert the current stack unstacking the functions and by default executing the oposeTargetFunction
 */
MovementsStack.prototype.invertStack = function () {

  if (this.stack.length > 0) {
    var movement = this.stack.pop(),
      milisecDuration = movement.duration * 1000;

    return Q.fcall(function () {

      if (movement.oposeTargetFunction && typeof movement.oposeTargetFunction === 'function') {
        movement.oposeTargetFunction();
      }

      return Q.delay(milisecDuration).then(function () {
        return this.invertStack();
      }.bind(this));

    }.bind(this));
  }
};

module.exports = MovementsStack;
