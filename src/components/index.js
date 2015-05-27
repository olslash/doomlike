/* @flow */
'use strict';

var _     = require('lodash');

var debug = require('../lib/debug')
var Component = require('../engine').Component;
var keymap = require('../config/keymap').bindings;

exports.Position = new Component('position', [{
  name: 'x',
  default: 0
}, {
  name: 'y',
  default: 0
}]);

exports.Collision = new Component('collision', [{
    name: 'colliding',
    default: false
}]);


exports.Visible = new Component('visible', [{
  name: 'character',
  default: 0
}, {
  name: 'foreground',
  default: 'white'
}]);

exports.Controllable = new Component('controllable', _.values(keymap));
exports.Weapon = new Component('weapon', [{
  name: 'firing',
  default: false
}]);

exports.Velocity = new Component('velocity', [{
  name: 'Vx',
  default: 0
}, {
  name: 'Vy',
  default: 0
}]);
