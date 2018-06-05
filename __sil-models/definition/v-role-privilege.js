const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.VRolePrivilege
 * 
 * @param {UUID}                 [roleId]             - 
 * @param {string}               [privileges]         - 
 */
class VRolePrivilege extends Model {
  static get tableName() {
    return 'VRolePrivilege';
  }

  static get idColumn() {
    return [];
  }

  static get relationMappings() {

    return {}
  }

  // This function is added to allow subclasses override schema before Joi object is compiled in joiSchema() static getter.
  static get rawJoiObject() {
    return {
      roleId: Joi.string().uuid(),
      privileges: Joi.string()
    };
  }

  static get joiSchema() {
    return Joi.object(VRolePrivilege.rawJoiObject);
  }
}

module.exports = VRolePrivilege;
