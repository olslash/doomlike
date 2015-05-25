/* @flow */
'use strict';

var _ = require('lodash');

var debug = require('./lib/debug');
var _entities = {};

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

  constructor(type: string, fields: ?Array<Field>) {
    this.type = type;
    this.fields = fields;
  }

  getInstance(options: ?Object = null): Object {
    // set every field as a property with null. can either be a string or an object with a name property
    // for any field object that has a 'default' property, set that value to the relevant field
    // TODO: validate fields
    var instance = {};

    var reset = Component.makeResetFunction(instance, this.fields);
    reset();

    instance.type = this.type;
    instance.entityId = null;
    instance.reset = reset;

    return instance;
  }

  static makeResetFunction(instance: Object, fields: ?Array<Field> = []): () => void {
    return function reset() {
      _.each(fields, function(field) {
        if(typeof field === 'string') {
          instance[field] = null;
        } else if(field.name){
          var defaultValue = typeof field.default === 'undefined' ? null : field.default;

          instance[field.name] = defaultValue;
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

// class _ComponentInstance {
//   options: Object;
//   type: string;
//   entityId: ?string;
//
//   constructor(options: ?Object = null) {
//
//     if(options) {
//
//       this.options = options;
//       _.assign(this, options);
//     }
//   }
//
//   reset() {
//     _.each(this.options, function(option) {
//       this[option] = null;
//     });
//   }
//
// }


function attachComponentToEntity(component: Object, entity: string|Entity) {
  if(typeof entity === 'string') {
    component.entityId = entity;
  } else {
    component.entityId = entity.id;
  }

  _.set(_entities[component.entityId], component.type, component);
}

class System {
  type              : string;
  requiredComponents: Array<string>;
  onTick            : (e: Array<Object>) => void;

  constructor(type: string, requiredComponents: Array<string>,
    onTick: (e: Array<Entity>) => void) {

    this.requiredComponents = requiredComponents;
    this.onTick = onTick;
  }

  tick() {
    // fixme: cache this and just update when new relevant components are added
    // should also maybe not touch irrelevant components.
    var relevantEntities = _(_entities)

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


    this.onTick(relevantEntities);
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
