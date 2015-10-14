/**
 * Utility methods to modify and customize auto generated models without affecting further auto generations.
 * Require this module from model customization scripts located in path/to/model/definitions-files-custom directory.
 * @class
 * @author Özüm Eldoğan
 */


/*jslint node: true */
"use strict";


/**
 * @constructor
 * @param model
 */
var GeneratorUtil = function (model) {
    this.model = model;
};


/**
 * Searches and returns relation with the given alias. Alias is defined in sequelize options with parameter 'as'
 * @method
 * @param {string} as - Alias of the relation.
 * @returns {Object}
 */
GeneratorUtil.prototype.getRelation = function (as) {
    var i,
        relations = this.model.relations;
    for (i = 0; i < relations.length; i = i + 1) {
        if (relations[i].details.as === as) {
            return relations[i];
        }
    }
};


/**
 * Searches and returns attribute with the given alias. Alias is defined in sequelize options with parameter 'as'
 * @method
 * @param {string} name - Name of the attribute.
 * @returns {Object}
 */
GeneratorUtil.prototype.getAttribute = function (name) {
    return this.model.attributes[name];
};


/**
 * Searches and returns attribute with the given alias. Alias is defined in sequelize options with parameter 'as'
 * @method
 * @param {string} oldName - Name of the attribute which it's name to be changed.
 * @param {string} newName - New name of the attribute.
 * @throws Will throw error if there is already an attribute with new name exists or attribute with oldName does not exists.
 */
GeneratorUtil.prototype.renameAttribute = function (oldName, newName) {
    if (this.model.attributes[newName] !== undefined) {
        throw new Error('There is already an attribute with the same name ("' + newName + '") in table "' + this.model.modelName + '".');
    }
    if (this.model.attributes[oldName] === undefined) {
        throw new Error('There is no attribute with the name "' + oldName + '". in table "' + this.model.modelName + '".');
    }
    this.model.attributes[newName] = this.model.attributes[oldName];
    delete this.model.attributes[oldName];
};


/**
 * Creates and returns new object with utility functions.
 * @param model
 * @returns {GeneratorUtil}
 */
module.exports = function (model) {
    return new GeneratorUtil(model);
};

