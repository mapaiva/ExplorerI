var five = require("johnny-five"),
  board = new five.Board(),
  xbox = require('xbox-controller-node'),
  MovementsStack = require('./movements-stack'),
  moveStack = new MovementsStack();

board.on("ready", function() {
  var config = five.Motor.SHIELD_CONFIGS.ADAFRUIT_V1,
    mLeft = new five.Motor(config.M1), // LEFT
    mRight = new five.Motor(config.M2), // RIGHT
    speed = 255;

  var forward = function () {
    mLeft.forward(speed);
    mRight.forward(speed);
  };

  var stop = function () {
    mLeft.stop();
    mRight.stop();
  };

  var reverse = function () {
    mLeft.reverse(speed);
    mRight.reverse(speed);
  };

  var turnLeft = function () {
    mLeft.forward(speed);
    mRight.reverse(speed);
  };

  var turnRight = function () {
    mLeft.reverse(speed);
    mRight.forward(speed);
  };

  xbox.on('leftstickUp', function () {
    moveStack.startMovement(forward, reverse);
  });

  xbox.on('leftstickUp:release', function () {
    stop();
    moveStack.endMovement();
  });

  xbox.on('leftstickDown', function () {
    moveStack.startMovement(reverse, forward);
  });

  xbox.on('leftstickDown:release', function () {
    stop();
    moveStack.endMovement();
  });

  xbox.on('leftstickLeft', function () {
    moveStack.startMovement(turnLeft, turnRight);
  });

  xbox.on('leftstickLeft:release', function () {
    stop();
    moveStack.endMovement();
  });

  xbox.on('leftstickRight', function () {
    moveStack.startMovement(turnRight, turnLeft);
  });

  xbox.on('leftstickRight:release', function () {
    stop();
    moveStack.endMovement();
  });

  // Motor speed control

  xbox.on('up', function () {
    if (speed < 255) {
      speed++;
    }

    console.log('Speed ', speed);
  });

  xbox.on('down', function () {
    if (speed > 1) {
      speed--;
    }

    console.log('Speed ', speed);
  });

  xbox.on('a', function () {
    console.log('Motor speed:', speed);
  });

  xbox.on('back',function () {

    if (!moveStack.isEmpty()) {
      console.log('Reversing...');

      moveStack.invertStack().done(function () {
        stop();
        console.log('Movements reversed XD');
      });
    } else {
      console.log('Movements stack empty!');
    }
  });

  xbox.on('b',function () {
    stop();
  });

  xbox.on('x', function () {
    moveStack.cleanStack();
    console.log('Movements stack cleaned');
  });
});
