/* @flow */
'use strict';

var _ = require('lodash');

var debug = require('./lib/debug');
var messageBus = require('./messageBus');

var _entities = {}; // global record of all entities

class Entity {
  id: string;

  constructor() {
    this.id = 'e' + Date.now();

    _entities[this.id] = this;
  }
}

type Field = string | {name: string; default: any};

class Component {
  type  : string;
  fields: ?Array<Field>;

  constructor(type: string, fields: ?Array<Field> = []) {
    this.type = type;
    this.fields = fields;
  }

  getInstance(options: ?Object = null): Object {
    // set every field as a property with null. can either be a string or an object with a name property
    // for any field object that has a 'default' property, set that value to the relevant field
    // TODO: validate fields
    var instance = {};

    var reset = Component.makeResetFunction(instance, this.fields, options);
    reset();

    instance.type = this.type;
    instance.entityId = null;
    instance.reset = reset;

    return instance;
  }

  static makeResetFunction(instance: Object, fields: ?Array<Field>, options: ?Object): () => void {

    return function reset() {
      _.each(fields, function(field) {
        if(typeof field === 'string') {
          instance[field] = null;
        } else if(field.name){
          var defaultValue = typeof field.default === 'undefined' ? null : field.default;

          var configuredValue;
          if(options) {
            configuredValue = options[field.name];
          }

          instance[field.name] = configuredValue ? configuredValue : defaultValue;
          debug(instance[field.name])
        } else {
          debug('bad field');
        }
      });
    }
  }


  // validate(options) {
  //   // make sure options has all the fields
  // }
}

function attachComponentToEntity(component: Object, entity: string|Entity) {
  if(typeof entity === 'string') {
    component.entityId = entity;
  } else {
    component.entityId = entity.id;
  }

  _.set(_entities[component.entityId], component.type, component);

  // broadcast that we've attached a component to an entity-- for the systems to update their caches
  messageBus.emit('component:attached', component.type);
}

class System {
  type              : string;
  requiredComponents: Array<string>;
  onTick            : (e: Array<Object>) => void;
  entities          : Array<Entity>;

  constructor(type: string, requiredComponents: Array<string>,
    onTick: (e: Array<Entity>) => void) {
    this.requiredComponents = requiredComponents;
    this.onTick = onTick;
    this.type = type;

    messageBus.on('component:attached', function(componentType: string) {
      if(_.includes(this.requiredComponents, componentType )) {
        this._updateCache();
      }
    }.bind(this))
  }

  _updateCache() {
    this.entities = _(_entities)
      .keys()

      .filter(function(entityId) {
        var entity = _entities[entityId];

        return _.every(this.requiredComponents, function(componentName) {
          return entity.hasOwnProperty(componentName);
        });
      }, this)

      .map(function(relevantEntityId) {
        return _entities[relevantEntityId];
      })

      .value();
  }

  tick() {
    this.onTick(this.entities);
  }
}

module.exports = {
  Entity,
  Component,
  System,

  attachComponentToEntity,

  // testing:
  _entities
};
