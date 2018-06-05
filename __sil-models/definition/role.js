const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.Role
 * Yetki gruplarını tutan tablo. Yetki grupları onu oluşturan business tarafından ve alt business'lar tarafından kullanılabilir. Alt business'ların kullanması opsiyonel olarak engellenebilir. businessId NULL olan gruplar tüm business'lar tarafından kullanılabilir ama değişiklik yapılamaz.
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {string}               [label]              - Yetki grubunun çeşitli dillerdeki adı. (x: Dil bağ...
 * @param {RoleField[]}          roleFields           - 
 * @param {RolePrivilege[]}      rolePrivileges       - 
 * @param {User[]}               users                - 
 * @param {Organization}         organization         - 
 * @param {Field[]}              fields               - 
 * @param {Privilege[]}          privileges           - 
 * @param {BusinessUnit[]}       businessUnits        - 
 */
class Role extends Model {
  static get tableName() {
    return 'Role';
  }

  static get idColumn() {
    return [`id`, `organizationId`];
  }

  static get relationMappings() {
    const RoleField = require('./role-field');
    const RolePrivilege = require('./role-privilege');
    const User = require('./user');
    const Organization = require('./organization');
    const Field = require('./field');
    const Privilege = require('./privilege');
    const BusinessUnit = require('./business-unit');

    return {
      roleFields: {
        relation: Model.HasManyRelation,
        modelClass: RoleField,
        join: {
          from: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`],
          to: [`${RoleField.tableName}.roleId`, `${RoleField.tableName}.organizationId`]
        }
      },
      rolePrivileges: {
        relation: Model.HasManyRelation,
        modelClass: RolePrivilege,
        join: {
          from: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`],
          to: [`${RolePrivilege.tableName}.roleId`, `${RolePrivilege.tableName}.organizationId`]
        }
      },
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`],
          to: [`${User.tableName}.roleId`, `${User.tableName}.organizationId`]
        }
      },
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: `${Role.tableName}.organizationId`,
          to: `${Organization.tableName}.id`
        }
      },
      fields: {
        relation: Model.ManyToManyRelation,
        modelClass: Field,
        join: {
          from: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`],
          through: {
            modelClass: RoleField,
            from: [`${RoleField.tableName}.roleId`, `${RoleField.tableName}.organizationId`],
            to: `${RoleField.tableName}.fieldId`
          },
          to: `${Field.tableName}.id`
        }
      },
      privileges: {
        relation: Model.ManyToManyRelation,
        modelClass: Privilege,
        join: {
          from: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`],
          through: {
            modelClass: RolePrivilege,
            from: [`${RolePrivilege.tableName}.roleId`, `${RolePrivilege.tableName}.organizationId`],
            to: `${RolePrivilege.tableName}.privilegeId`
          },
          to: `${Privilege.tableName}.id`
        }
      },
      businessUnits: {
        relation: Model.ManyToManyRelation,
        modelClass: BusinessUnit,
        join: {
          from: [`${Role.tableName}.id`, `${Role.tableName}.organizationId`],
          through: {
            modelClass: User,
            from: [`${User.tableName}.roleId`, `${User.tableName}.organizationId`],
            to: [`${User.tableName}.businessUnitId`, `${User.tableName}.organizationId`]
          },
          to: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`]
        }
      }
    }
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      id: Joi.string().uuid(),
      organizationId: Joi.string().uuid().required(),
      label: Joi.string()
    };
  }

  static get joiSchema() {
    return Joi.object(Role.rawJoiObject);
  }
}

module.exports = Role;
