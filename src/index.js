/* @flow */
'use strict';

var _     = require('lodash');
var charm = require('charm')();

var engine = require('./engine');
var Entity = engine.Entity;
var components = require('./components');
var renderSystem = require('./systems/render');
var controllableSystem = require('./systems/controllable');

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
engine.attachComponentToEntity(components.Controllable.getInstance(), someEnemy);


var fps = 0;
// clear()
function gameLoop() {
  fps ++;
  // todo: bookkeeping of systems-- automatically tick all of them
  renderSystem.tick();
  controllableSystem.tick();
  setImmediate(gameLoop);
}

setInterval(function() {
  charm.position(0, 10)
  charm.write('fps: ' + fps)
  fps = 0;
}, 1000)

gameLoop()
