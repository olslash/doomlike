/* @flow */
'use strict';

var _     = require('lodash');
var charm = require('charm')();

var engine = require('./engine');
var Entity = engine.Entity;
var components = require('./components');
var renderSystem = require('./systems/render');

charm.pipe(process.stdout);
charm.reset();
charm.cursor(false);

var someEnemy: Entity = new Entity();
var enemyPosition = components.Position.getInstance({
  x: 2,
  y: 2
});


var visible = components.Visible.getInstance({
  character: 'O',
  foreground: 'red'
});

engine.attachComponentToEntity(enemyPosition, someEnemy);
engine.attachComponentToEntity(visible, someEnemy);



var fps = 0;
// clear()
function gameLoop() {
  fps ++
  renderSystem.tick();
  setImmediate(gameLoop);
}

setInterval(function() {
  charm.position(0, 10)
  charm.write('fps: ' + fps)
  fps = 0;
}, 1000)

gameLoop()
