const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.knex_migrations
 * 
 * @param {string}               [name]               - 
 * @param {number}               [batch]              - 
 */
class KnexMigration extends Model {
  static get tableName() {
    return 'knex_migrations';
  }

  static get idColumn() {
    return `id`;
  }

  static get relationMappings() {

    return {}
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      id: Joi.number().integer().min(1).max(2147483647),
      name: Joi.string().max(255),
      batch: Joi.number().integer().min(-2147483648).max(2147483647)
    };
  }

  static get joiSchema() {
    return Joi.object(KnexMigration.rawJoiObject);
  }
}

module.exports = KnexMigration;
