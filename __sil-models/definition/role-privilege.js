const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.RolePrivilege
 * Yetki gruplarının hangi yetkilere sahip olduğunu tutan tablo.
 * @param {Privilege}            privilege            - 
 * @param {Role}                 role                 - 
 */
class RolePrivilege extends Model {
  static get tableName() {
    return 'RolePrivilege';
  }

  static get idColumn() {
    return [`roleId`, `organizationId`, `privilegeId`];
  }

  static get relationMappings() {
    const Privilege = require('./privilege');
    const Role = require('./role');

    return {
      privilege: {
        relation: Model.BelongsToOneRelation,
        modelClass: Privilege,
        join: {
          from: `${RolePrivilege.tableName}.privilegeId`,
          to: `${Privilege.tableName}.id`
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: [`${RolePrivilege.tableName}.roleId`, `${RolePrivilege.tableName}.organizationId`],
          to: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`]
        }
      }
    }
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      roleId: Joi.string().uuid().required(),
      organizationId: Joi.string().uuid().required(),
      privilegeId: Joi.string().uuid().required()
    };
  }

  static get joiSchema() {
    return Joi.object(RolePrivilege.rawJoiObject);
  }
}

module.exports = RolePrivilege;
