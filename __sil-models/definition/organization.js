const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.Organization
 * Organizasyon ile ilgili bilgilerin tutulduğu tablo.
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {boolean}              [isActive]           - Kayıt aktif mi$2
 * @param {BusinessUnit[]}       businessUnits        - 
 * @param {Role[]}               roles                - 
 * @param {BusinessUnit[]}       [businessUnitParents] - 
 */
class Organization extends Model {
  static get tableName() {
    return 'Organization';
  }

  static get idColumn() {
    return `id`;
  }

  static get relationMappings() {
    const BusinessUnit = require('./business-unit');
    const Role = require('./role');

    return {
      businessUnits: {
        relation: Model.HasManyRelation,
        modelClass: BusinessUnit,
        join: {
          from: `${Organization.tableName}.id`,
          to: `${BusinessUnit.tableName}.organizationId`
        }
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: Role,
        join: {
          from: `${Organization.tableName}.id`,
          to: `${Role.tableName}.organizationId`
        }
      },
      businessUnitParents: {
        relation: Model.ManyToManyRelation,
        modelClass: BusinessUnit,
        join: {
          from: `${Organization.tableName}.id`,
          through: {
            modelClass: BusinessUnit,
            from: `${BusinessUnit.tableName}.organizationId`,
            to: [`${BusinessUnit.tableName}.parentId`, `${BusinessUnit.tableName}.organizationId`]
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
      isActive: Joi.boolean()
    };
  }

  static get joiSchema() {
    return Joi.object(Organization.rawJoiObject);
  }
}

module.exports = Organization;
