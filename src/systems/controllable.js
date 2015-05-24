/* @flow */
'use strict';

var _     = require('lodash');
var keypress = require('keypress');

var System = require('../engine').System;


var MOVE_SPEED = 10;

var keymap = {
  'w': 'forward',
  's': 'back',
  'a': 'left',
  'd': 'right'
};

// when a given key is held, what keys should be canceled?
var precludeKeys = {
  'forward': ['back'],
  'back'   : ['forward'],
  'left'   : ['right'],
  'right'  : ['left'],
}
var activeKeys = {};

module.exports = new System('controllable', ['position'], function(entities) {
  var moveDist = MOVE_SPEED / 100;

  _.each(entities, function(entity) {
    if(activeKeys.forward) {
      entity.position.y -= moveDist;
    }

    if(activeKeys.back) {
      entity.position.y += moveDist;
    }

    if(activeKeys.left) {
      entity.position.x -= moveDist;
    }

    if(activeKeys.right) {
      entity.position.x += moveDist;
    }
  });

});

keypress(process.stdin);
process.stdin.setRawMode(true)

process.stdin.on('keypress', function (ch, key) {
  if(key && key.name in keymap) {
    var action = keymap[key.name]
    activeKeys[action] = true;

    var precluded = precludeKeys[action];
    _.each(precluded, function(key) {
      delete activeKeys[key];
    });
  }



  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});
