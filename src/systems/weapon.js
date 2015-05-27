/* @flow */
'use strict';

var _     = require('lodash');
var keypress = require('keypress');

var debug = require('../lib/debug');
var engine = require('../engine');
var System = engine.System;
var components = require('../components');

module.exports = new System('weapon', ['weapon', 'position'], function(entities) {
  _.each(entities, function(entity) {
    // if(entity.controllable.fire) {
    //   debug('fire')
    // }
    if(entity.controllable.fire) { // set by system-controllable
      debug('adding a bullet')
      // make an entity to represent a bullet
      // attach collision and position and velocity components
      var bullet: engine.Entity = new engine.Entity();

      engine.attachComponentToEntity(components.Position.getInstance({
        // bullet starts at player position
        // todo: offset this based on velocity-- shouldn't spawn right on player
        x: entity.position.x,
        y: entity.position.y
      }), bullet);

      engine.attachComponentToEntity(components.Collision.getInstance({
        colliding: false
      }), bullet); // fixme-- should just default to false

      engine.attachComponentToEntity(components.Velocity.getInstance({
        Vx: entity.velocity.Vx * 2.5,
        Vy: entity.velocity.Vy * 2.5// todo: base on player velocity?
      }), bullet);

      engine.attachComponentToEntity(components.Visible.getInstance({
        character: 'o',
        foreground: 'blue'
      }), bullet);

      entity.weapon.firing = false;
    }
  });
});
