/* @flow */
'use strict';

var _     = require('lodash');
var keypress = require('keypress');

var System = require('../engine').System;

var keymap = {
  'w': 'forward',
  's': 'back',
  'a': 'left',
  'd': 'right'
};
var activeKeys = {};

module.exports = new System('controllable', ['position'], function(entities) {
  _.each(entities, function(entity) {
    if(activeKeys.forward) {
      entity.position.y--;
    }

    if(activeKeys.back) {
      entity.position.y++;
    }

    if(activeKeys.left) {
      entity.position.x--;
    }

    if(activeKeys.right) {
      entity.position.x++;
    }
  });
  activeKeys = {};
});

keypress(process.stdin);
process.stdin.setRawMode(true)

process.stdin.on('keypress', function (ch, key) {
  if(key && key.name in keymap) {
    var action = keymap[key.name]
    activeKeys[action] = true;
  }

  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});
