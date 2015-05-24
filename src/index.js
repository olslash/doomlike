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
  character: 'O',
  foreground: 'red'
});


engine.attachComponentToEntity(enemyPosition, someEnemy);
engine.attachComponentToEntity(visible, someEnemy);


var renderSystem = new System('render', ['visible', 'position'], function(entities) {
  type Pixel = {
    foreground: string;
    character : string;
  }

  type Grid = Array< Array<Pixel> >;

  var gridSize = 5;

  var bgPixel: Pixel = {
    foreground: 'green',
    character: '.'
  }

  // build grid backbround
  var grid: Grid = _.map(new Array(gridSize), function() {
    return _.fill(Array(gridSize), bgPixel);
  });

  // write changes
  _.each(entities, function(entity) {
    grid[entity.position.y][entity.position.x] = {
      foreground: entity.visible.foreground,
      character: entity.visible.character
    };
  });

  // write to screen
  _.each(grid, function(row, y) {
    _.each(row, function(pixel: Pixel, x) {
      charm.position(x + 1, y + 1); // charm needs to be 1-indexed
      charm.foreground(pixel.foreground);
      charm.write(pixel.character);
    });
  });
});

var fps = 0;
// clear()
function gameLoop() {
  fps ++
  renderSystem.tick();
  setImmediate(gameLoop);
}
//
//
setInterval(function() {
  charm.position(0, 10)
  charm.write('fps: ' + fps)
  fps = 0;
}, 1000)

gameLoop()
