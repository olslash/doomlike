/* @flow */
'use strict';

var _     = require('lodash');

var Component = require('../engine').Component;

exports.Position = new Component('position', ['x', 'y']);
exports.Visible = new Component('visible', ['character']);
