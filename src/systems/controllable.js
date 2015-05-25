/* @flow */
'use strict';

var _     = require('lodash');
var keypress = require('keypress');

var System = require('../engine').System;
var debug = require('../lib/debug');
var keymap = require('../config/keymap').bindings;

var MOVE_SPEED = 100;

var activeKeys = {};
module.exports = new System('controllable', ['position', 'controllable'], function(entities) {
  // look at activekeys and set flags on the entities
  _.each(entities, function(entity) {
    entity.controllable.reset();

    for(var key in activeKeys) {
      entity.controllable[key] = true
    }
  });

  var moveDist = MOVE_SPEED / 100;

  _.each(entities, function(entity) {
    if(entity.controllable.forward) {
      debug('forward');
    }

    if(entity.controllable.back) {
      debug('back');
    }

    if(entity.controllable.left) {
      debug('left');
    }

    if(entity.controllable.right) {
      debug('right');
    }

    if(entity.controllable.fire) {

      if(entity.weapon) {
        debug('fire');
        entity.weapon.firing = true;
      }
    }
  });

  activeKeys = {};
});

keypress(process.stdin);
process.stdin.setRawMode(true)


// keyup should be basically spring loaded-- use debounce

// var preventKeyup = _.debounce(function() {
//   activeKeys = {};
// }, 200);

process.stdin.on('keypress', function (ch, key) {
  // preventKeyup();


  if(key && key.name in keymap) {
    var action = keymap[key.name]
    activeKeys[action] = true;

  //   var precluded = precludeKeys[action];
  //   _.each(precluded, function(key) {
  //     delete activeKeys[key];
  //   });
  }



  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});
