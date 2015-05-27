/* @flow */
'use strict';

var _     = require('lodash');
var keypress = require('keypress');

var System = require('../engine').System;
var debug = require('../lib/debug');
var keymap = require('../config/keymap').bindings;


var activeKeys = {};
module.exports = new System('controllable', ['position', 'controllable', 'velocity'], function(entities) {
  // look at activekeys and set flags on the entities
  _.each(entities, function(entity) {
    entity.controllable.reset();

    for(var key in activeKeys) {
      entity.controllable[key] = true
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
