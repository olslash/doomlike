/* @flow */

'use strict';

var _ = require('lodash');

var _entities = {};

class Entity {
  id: string;

  constructor() {
    this.id = 'e' + Date.now();

    _entities[this.id] = this;
  }
}

class Component {
  type  : string;
  fields: ?Array<string>;

  constructor(type: string, fields: ?Array<string> = null) {
    this.type = type;
    this.fields = fields;
  }

  getInstance(options: ?Object = null): Object {
    // todo: validate the fields and attach defaults
    var instance = {};

    if(options) {
      instance = _.clone(options);
    }

    instance.type = this.type;
    instance.entityId = null;

    return instance;
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


    return this.onTick(relevantEntities);
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
