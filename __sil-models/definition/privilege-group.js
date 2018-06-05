const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.PrivilegeGroup
 * Yetkilerin tasnif edilmesi için kullanılan grupları tutan tablo. (Ekranda ilgili yetkilerin bir arada gösterilmesi için.)
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {string}               label                - Yetki grubunun ekranda gösterilecek ismi.
 * @param {Privilege[]}          [privileges]         - 
 * @param {Operation[]}          [operations]         - 
 */
class PrivilegeGroup extends Model {
  static get tableName() {
    return 'PrivilegeGroup';
  }

  static get idColumn() {
    return `id`;
  }

  static get relationMappings() {
    const Privilege = require('./privilege');
    const Operation = require('./operation');

    return {
      privileges: {
        relation: Model.HasManyRelation,
        modelClass: Privilege,
        join: {
          from: `${PrivilegeGroup.tableName}.id`,
          to: `${Privilege.tableName}.privilegeGroupId`
        }
      },
      operations: {
        relation: Model.ManyToManyRelation,
        modelClass: Operation,
        join: {
          from: `${PrivilegeGroup.tableName}.id`,
          through: {
            modelClass: Privilege,
            from: `${Privilege.tableName}.privilegeGroupId`,
            to: `${Privilege.tableName}.operationName`
          },
          to: `${Operation.tableName}.name`
        }
      }
    }
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      id: Joi.string().uuid(),
      label: Joi.string().required()
    };
  }

  static get joiSchema() {
    return Joi.object(PrivilegeGroup.rawJoiObject);
  }
}

module.exports = PrivilegeGroup;
