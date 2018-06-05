const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.User
 * Uygulama kullanıcılarının tutulduğu tablo.
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {string}               [privileges]         - (Trigger) Kullanıcının yetkileri.
 * @param {boolean}              [isActive]           - Kullanıcı aktif mi$1
 * @param {BusinessUnit}         businessUnit         - 
 * @param {Role}                 role                 - 
 */
class User extends Model {
  static get tableName() {
    return 'User';
  }

  static get idColumn() {
    return [`id`, `organizationId`];
  }

  static get relationMappings() {
    const BusinessUnit = require('./business-unit');
    const Role = require('./role');

    return {
      businessUnit: {
        relation: Model.BelongsToOneRelation,
        modelClass: BusinessUnit,
        join: {
          from: [`${User.tableName}.businessUnitId`, `${User.tableName}.organizationId`],
          to: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`]
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: [`${User.tableName}.roleId`, `${User.tableName}.organizationId`],
          to: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`]
        }
      }
    }
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      id: Joi.string().uuid(),
      organizationId: Joi.string().uuid().required(),
      businessUnitId: Joi.string().uuid().required(),
      roleId: Joi.string().uuid().required(),
      privileges: Joi.string(),
      isActive: Joi.boolean()
    };
  }

  static get joiSchema() {
    return Joi.object(User.rawJoiObject);
  }
}

module.exports = User;
