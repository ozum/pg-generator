const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.BusinessUnit
 * İş birimleri ile ilgili bilgileri tutan tablo.
 * @param {UUID}                 [id]                 - Kayıt no.
 * @param {UUID[]}               [parentsRecursive]   - (TRIGGER) Tüm parent'larını recursive olarak tutan...
 * @param {UUID[]}               [childrenRecursive]  - (TRIGGER) Recursive olarak tüm child'larını tutan ...
 * @param {UUID[]}               [parentsRecursiveActive] - (TRIGGER) Tüm aktif parent'larını recursive olarak...
 * @param {UUID[]}               [childrenRecursiveActive] - (TRIGGER) Recursive olarak tüm aktif child'ları tu...
 * @param {boolean}              [isActive]           - İş birimi aktif mi$3
 * @param {BusinessUnit[]}       [businessUnits]      - 
 * @param {User[]}               users                - 
 * @param {BusinessUnit}         [businessUnit]       - 
 * @param {Organization}         organization         - 
 * @param {Organization[]}       organizations        - 
 * @param {Role[]}               roles                - 
 */
class BusinessUnit extends Model {
  static get tableName() {
    return 'BusinessUnit';
  }

  static get idColumn() {
    return [`id`, `organizationId`];
  }

  static get relationMappings() {
    const User = require('./user');
    const Organization = require('./organization');
    const Role = require('./role');

    return {
      businessUnits: {
        relation: Model.HasManyRelation,
        modelClass: BusinessUnit,
        join: {
          from: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`],
          to: [`${BusinessUnit.tableName}.parentId`, `${BusinessUnit.tableName}.organizationId`]
        }
      },
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`],
          to: [`${User.tableName}.businessUnitId`, `${User.tableName}.organizationId`]
        }
      },
      businessUnit: {
        relation: Model.BelongsToOneRelation,
        modelClass: BusinessUnit,
        join: {
          from: [`${BusinessUnit.tableName}.parentId`, `${BusinessUnit.tableName}.organizationId`],
          to: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`]
        }
      },
      organization: {
        relation: Model.BelongsToOneRelation,
        modelClass: Organization,
        join: {
          from: `${BusinessUnit.tableName}.organizationId`,
          to: `${Organization.tableName}.id`
        }
      },
      organizations: {
        relation: Model.ManyToManyRelation,
        modelClass: Organization,
        join: {
          from: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`],
          through: {
            modelClass: BusinessUnit,
            from: [`${BusinessUnit.tableName}.parentId`, `${BusinessUnit.tableName}.organizationId`],
            to: `${BusinessUnit.tableName}.organizationId`
          },
          to: `${Organization.tableName}.id`
        }
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: [`${BusinessUnit.tableName}.id`, `${BusinessUnit.tableName}.organizationId`],
          through: {
            modelClass: User,
            from: [`${User.tableName}.businessUnitId`, `${User.tableName}.organizationId`],
            to: [`${User.tableName}.roleId`, `${User.tableName}.organizationId`]
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
      organizationId: Joi.string().uuid().required(),
      parentId: Joi.string().uuid(),
      parentsRecursive: Joi.array().items(Joi.string().uuid()),
      childrenRecursive: Joi.array().items(Joi.string().uuid()),
      parentsRecursiveActive: Joi.array().items(Joi.string().uuid()),
      childrenRecursiveActive: Joi.array().items(Joi.string().uuid()),
      isActive: Joi.boolean()
    };
  }

  static get joiSchema() {
    return Joi.object(BusinessUnit.rawJoiObject);
  }
}

module.exports = BusinessUnit;
