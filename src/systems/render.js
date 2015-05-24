/* @flow */
'use strict';

var _     = require('lodash');
var charm = require('charm')();

var System = require('../engine').System;

module.exports = new System('render', ['visible', 'position'], function(entities) {
  type Pixel = {
    foreground: string;
    character : string;
  }

  type Grid = Array< Array<Pixel> >;

  var gridSize = 25;

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
    // clamp entity to bounds
    if(entity.position.x >= gridSize) {
        entity.position.x = gridSize - 1;
    }
    if(entity.position.x < 0) {
        entity.position.x = 0;
    }

    if(entity.position.y >= gridSize) {
        entity.position.y = gridSize - 1;
    }
    if(entity.position.y < 0) {
        entity.position.y = 0;
    }




    grid[Math.floor(entity.position.y)][Math.floor(entity.position.x)] = {
      foreground: entity.visible.foreground,
      character: entity.visible.character
    };
  });

  // write to screen
  _.each(grid, function(row, y) {
    _.each(row, function(pixel: Pixel, x) {
      // +1 because charm needs to be 1-indexed
      charm.position(Math.floor(x + 1), Math.floor(y + 1));
      charm.foreground(pixel.foreground);
      charm.write(pixel.character);
    });
  });
});
