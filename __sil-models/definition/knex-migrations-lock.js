const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.knex_migrations_lock
 * 
 * @param {number}               [is_locked]          - 
 */
class KnexMigrationsLock extends Model {
  static get tableName() {
    return 'knex_migrations_lock';
  }

  static get idColumn() {
    return [];
  }

  static get relationMappings() {

    return {}
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      is_locked: Joi.number().integer().min(-2147483648).max(2147483647)
    };
  }

  static get joiSchema() {
    return Joi.object(KnexMigrationsLock.rawJoiObject);
  }
}

module.exports = KnexMigrationsLock;
