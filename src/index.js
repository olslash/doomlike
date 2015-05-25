/* @flow */
'use strict';

var _     = require('lodash');
var charm = require('charm')();

var debug = require('./lib/debug');
var raf = require('./lib/requestAnimationFrame');
var engine = require('./engine');
var Entity = engine.Entity;

var renderSystem = require('./systems/render');
var controllableSystem = require('./systems/controllable');
var weaponSystem = require('./systems/weapon');
var components = require('./components');

charm.pipe(process.stdout);
charm.reset();
charm.cursor(false);

var player: Entity = new Entity();
var enemyPosition = components.Position.getInstance({
  x: 2,
  y: 2
});


var visible = components.Visible.getInstance({
  character: 'O',
  foreground: 'red'
});

var weapon = components.Weapon.getInstance({});


engine.attachComponentToEntity(enemyPosition, player);
engine.attachComponentToEntity(visible, player);
engine.attachComponentToEntity(weapon, player);
engine.attachComponentToEntity(components.Controllable.getInstance(), player);


var fps = 0;
// clear()
function gameLoop() {
  fps ++;
  // todo: bookkeeping of systems-- automatically tick all of them
  controllableSystem.tick();
  weaponSystem.tick();
  // renderSystem.tick();
  setImmediate(gameLoop)
  // raf.requestAnimationFrame(gameLoop)
}

setInterval(function() {
  charm.position(0, 30)
  debug('FPS: ' + fps)
  fps = 0;
}, 1000)

gameLoop()
