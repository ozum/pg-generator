const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.Operation
 * Privilege'ler için uygulanabilecek operasyonları tutan tablo. (Create, Read, Update, Delete vb.)
 * @param {string}               name                 - 
 * @param {Privilege[]}          [privileges]         - 
 * @param {PrivilegeGroup[]}     [privilegeGroups]    - 
 */
class Operation extends Model {
  static get tableName() {
    return 'Operation';
  }

  static get idColumn() {
    return `name`;
  }

  static get relationMappings() {
    const Privilege = require('./privilege');
    const PrivilegeGroup = require('./privilege-group');

    return {
      privileges: {
        relation: Model.HasManyRelation,
        modelClass: Privilege,
        join: {
          from: `${Operation.tableName}.name`,
          to: `${Privilege.tableName}.operationName`
        }
      },
      privilegeGroups: {
        relation: Model.ManyToManyRelation,
        modelClass: PrivilegeGroup,
        join: {
          from: `${Operation.tableName}.name`,
          through: {
            modelClass: Privilege,
            from: `${Privilege.tableName}.operationName`,
            to: `${Privilege.tableName}.privilegeGroupId`
          },
          to: `${PrivilegeGroup.tableName}.id`
        }
      }
    }
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      name: Joi.string().max(15).required()
    };
  }

  static get joiSchema() {
    return Joi.object(Operation.rawJoiObject);
  }
}

module.exports = Operation;
