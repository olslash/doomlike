/* @flow */

'use strict';

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
  var grid = [
    ['.','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','.','.'],
  ];

  entities.forEach(function(entity) {
    grid[entity.position.y][entity.position.x] = entity.visible.character;
  })
  console.log(grid);
  clear();
  // process.stdout.write(grid.join(''));
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


function clear() {
  process.stdout.write('\u001B[2J\u001B[0;0f');
}
