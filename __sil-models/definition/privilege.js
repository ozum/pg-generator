const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.Privilege
 * Yetkilerin tanımlarını tutan tablo.
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {string}               name                 - Yetkinin yazılımda kullanılacak olan ismi.
 * @param {string}               [label]              - Yetkinin çeşitli dillerde kullanıcıya gösterilecek...
 * @param {Field[]}              fields               - 
 * @param {RolePrivilege[]}      rolePrivileges       - 
 * @param {Operation}            [operation]          - 
 * @param {PrivilegeGroup}       [privilegeGroup]     - 
 * @param {Role[]}               roles                - 
 */
class Privilege extends Model {
  static get tableName() {
    return 'Privilege';
  }

  static get idColumn() {
    return `id`;
  }

  static get relationMappings() {
    const Field = require('./field');
    const RolePrivilege = require('./role-privilege');
    const Operation = require('./operation');
    const PrivilegeGroup = require('./privilege-group');
    const Role = require('./role');

    return {
      fields: {
        relation: Model.HasManyRelation,
        modelClass: Field,
        join: {
          from: `${Privilege.tableName}.id`,
          to: `${Field.tableName}.privilegeId`
        }
      },
      rolePrivileges: {
        relation: Model.HasManyRelation,
        modelClass: RolePrivilege,
        join: {
          from: `${Privilege.tableName}.id`,
          to: `${RolePrivilege.tableName}.privilegeId`
        }
      },
      operation: {
        relation: Model.BelongsToOneRelation,
        modelClass: Operation,
        join: {
          from: `${Privilege.tableName}.operationName`,
          to: `${Operation.tableName}.name`
        }
      },
      privilegeGroup: {
        relation: Model.BelongsToOneRelation,
        modelClass: PrivilegeGroup,
        join: {
          from: `${Privilege.tableName}.privilegeGroupId`,
          to: `${PrivilegeGroup.tableName}.id`
        }
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: `${Privilege.tableName}.id`,
          through: {
            modelClass: RolePrivilege,
            from: `${RolePrivilege.tableName}.privilegeId`,
            to: [`${RolePrivilege.tableName}.roleId`, `${RolePrivilege.tableName}.organizationId`]
          },
          to: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`]
        }
      }
    }
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      id: Joi.string().uuid(),
      privilegeGroupId: Joi.string().uuid(),
      operationName: Joi.string().max(15),
      name: Joi.string().max(30).required(),
      label: Joi.string()
    };
  }

  static get joiSchema() {
    return Joi.object(Privilege.rawJoiObject);
  }
}

module.exports = Privilege;
