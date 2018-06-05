const {
  Model
} = require('schwifty');
const Joi = require('joi');

/* eslint-disable require-jsdoc, max-len, global-require */

/**
 * public.VRoleOperationPrivilege
 * Her bir rolün her bir privilege üzerindeki yetki seviyelerini JSON olarak döndüren view.
 * @param {UUID}                 [roleId]             - 
 * @param {string}               [privilegeName]      - 
 * @param {string}               [operationAccessLevel] - 
 */
class VRoleOperationPrivilege extends Model {
  static get tableName() {
    return 'VRoleOperationPrivilege';
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
      privilegeName: Joi.string().max(30),
      operationAccessLevel: Joi.string()
    };
  }

  static get joiSchema() {
    return Joi.object(VRoleOperationPrivilege.rawJoiObject);
  }
}

module.exports = VRoleOperationPrivilege;
