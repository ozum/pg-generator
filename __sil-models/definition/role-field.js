const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.RoleField
 * Rollerin yetkisinin kısıtlı olduğu alanları tutan tablo. (Bu tabloda kaydı yoksa hiç bir kısıtlama yok demektir.)
 * @param {Field}                field                - 
 * @param {Role}                 role                 - 
 */
class RoleField extends Model {
  static get tableName() {
    return 'RoleField';
  }

  static get idColumn() {
    return [`roleId`, `organizationId`, `fieldId`];
  }

  static get relationMappings() {
    const Field = require('./field');
    const Role = require('./role');

    return {
      field: {
        relation: Model.BelongsToOneRelation,
        modelClass: Field,
        join: {
          from: `${RoleField.tableName}.fieldId`,
          to: `${Field.tableName}.id`
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: [`${RoleField.tableName}.roleId`, `${RoleField.tableName}.organizationId`],
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
      fieldId: Joi.string().uuid().required()
    };
  }

  static get joiSchema() {
    return Joi.object(RoleField.rawJoiObject);
  }
}

module.exports = RoleField;
