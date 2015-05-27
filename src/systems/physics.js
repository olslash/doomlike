/* @flow */
'use strict';

var _     = require('lodash');

var System = require('../engine').System;
var debug = require('../lib/debug');

var MOVEMENT_DECAY = .015; // per frame

module.exports = new System('physics', ['position', 'velocity'], function(entities) {
  _.each(entities, function(entity) {
    var Vx: number = entity.velocity.Vx;
    var Vy: number = entity.velocity.Vy;

    // just add velocity in each direction directly to the position
    entity.position.x += Vx;
    entity.position.y += Vy;

    // decay
    entity.velocity.Vx = decay(Vx, MOVEMENT_DECAY);
    entity.velocity.Vy = decay(Vy, MOVEMENT_DECAY);
  });
});

// decay towards zero
function decay(start: number, rate: number): number {
  var newV = 0;

  if(start > 0) {
    newV = start - rate;
    if(newV < 0) newV = 0;

  } else if(start < 0) {
    newV = start + rate;
    if(newV > 0) newV = 0;
  }

  return newV;
}
