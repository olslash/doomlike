/* @flow */
'use strict';

var _     = require('lodash');

var System = require('../engine').System;
var debug = require('../lib/debug');

var ACCEL_RATE = 0.4;
var MAX_VELOCITY = 0.6;

module.exports = new System('playerMovement', ['position', 'controllable', 'velocity'], function(entities) {
  _.each(entities, function(entity) {
    var Vy = entity.velocity.Vy;
    var Vx = entity.velocity.Vx;

    if(entity.controllable.forward) {
      entity.velocity.Vy = clamp(Vy - ACCEL_RATE, MAX_VELOCITY);
    }

    if(entity.controllable.back) {
      entity.velocity.Vy = clamp(Vy + ACCEL_RATE, MAX_VELOCITY);
    }

    if(entity.controllable.right) {
      entity.velocity.Vx = clamp(Vx + ACCEL_RATE, MAX_VELOCITY);
    }

    if(entity.controllable.left) {
      entity.velocity.Vx = clamp(Vx - ACCEL_RATE, MAX_VELOCITY);
    }
  });
});

function clamp(num: number, minmax: number): number {
  if(num > minmax) {
    num = minmax;
  }

  if(num < -minmax) {
    num = -minmax;
  }

  return num;
}
