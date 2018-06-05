const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.Field
 * Kısıtlanabilir alanları tutan tablo.
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {string}               name                 - Alanın adı.
 * @param {string}               [label]              - Alanın çeşitli dillerde kullanıcıya gösterilecek a...
 * @param {RoleField[]}          roleFields           - 
 * @param {Privilege}            privilege            - 
 * @param {Role[]}               roles                - 
 */
class Field extends Model {
  static get tableName() {
    return 'Field';
  }

  static get idColumn() {
    return `id`;
  }

  static get relationMappings() {
    const RoleField = require('./role-field');
    const Privilege = require('./privilege');
    const Role = require('./role');

    return {
      roleFields: {
        relation: Model.HasManyRelation,
        modelClass: RoleField,
        join: {
          from: `${Field.tableName}.id`,
          to: `${RoleField.tableName}.fieldId`
        }
      },
      privilege: {
        relation: Model.BelongsToOneRelation,
        modelClass: Privilege,
        join: {
          from: `${Field.tableName}.privilegeId`,
          to: `${Privilege.tableName}.id`
        }
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: `${Field.tableName}.id`,
          through: {
            modelClass: RoleField,
            from: `${RoleField.tableName}.fieldId`,
            to: [`${RoleField.tableName}.roleId`, `${RoleField.tableName}.organizationId`]
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
      privilegeId: Joi.string().uuid().required(),
      name: Joi.string().max(40).required(),
      label: Joi.string()
    };
  }

  static get joiSchema() {
    return Joi.object(Field.rawJoiObject);
  }
}

module.exports = Field;
