/* @flow */
'use strict';

var _     = require('lodash');
var charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();
charm.cursor(false);

var engine = require('./engine');
var Entity = engine.Entity;
var Component = engine.Component;
var System = engine.System;

var PositionComponent = new Component('position', ['x', 'y']);

var someEnemy: Entity = new Entity();
var enemyPosition = PositionComponent.getInstance({
  x: 2,
  y: 2
});


var visibleComponent = new Component('visible', ['character']);
var visible = visibleComponent.getInstance({
  character: 'O'
});


engine.attachComponentToEntity(enemyPosition, someEnemy);
engine.attachComponentToEntity(visible, someEnemy);

var renderSystem = new System('render', ['visible', 'position'], function(entities) {
  charm.position(0,0);
  charm.foreground('green');

  var grid = [
    '.....',
    '.....',
    '.....',
    '.....',
    '.....'
  ];

  _.each(grid, function(row, i) {
    charm.position(0, i);
    charm.write(row)
  });

  _.each(entities, function(entity) {
    charm.position(entity.position.y, entity.position.x);
    charm.foreground('red');
    charm.write(entity.visible.character);
  });
});

// var fps = 0;
// clear()
function gameLoop() {
  // fps ++
  renderSystem.tick();
  setImmediate(gameLoop);
}
//
//
// setInterval(function() {
//   clear();
//   console.log('fps:', fps);
//   fps = 0;
// }, 1000)

gameLoop()
