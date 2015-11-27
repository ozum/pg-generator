'use strict';

// This file is used for providing additional data to templates during generation phase.

/**
 * @external pgStructure
 * @see {@link http://www.pg-structure.com}
 */

/**
 * Object returned from this function will be merged with template variables and available in every template file.
 * This function is executed for each generated file.
 * @param {pgStructure.db}  db  - {@link http://www.pg-structure.com/api/DB/ pg-structure db object}.
 * @returns {Object}            - Object to be merged with template variables.
 */
function allData(db) {
    return {};
}

/**
 * Object returned from this function will be merged with template variables and available in templates located in
 * db directory. This function is executed for each generated file resulted from templates in db directory.
 * @param {pgStructure.db}  db  - {@link http://www.pg-structure.com/api/DB/ pg-structure db object}.
 * @returns {Object}            - Object to be merged with template variables.
 */
function dbData(db) {
    return {};
}

/**
 * Object returned from this function will be merged with template variables and available in templates located in
 * schema directory. This function is executed for each generated file resulted from templates in schema directory.
 * @param {pgStructure.schema}  schema  - {@link http://www.pg-structure.com/api/Schema/ pg-structure schema object}.
 * @returns {Object}                    - Object to be merged with template variables.
 */
function schemaData(schema) {
    return {};
}

/**
 * Object returned from this function will be merged with template variables and available in templates located in
 * table directory. This function is executed for each generated file resulted from templates in table directory.
 * @param {pgStructure.table}  table    - {@link http://www.pg-structure.com/api/Table/ pg-structure table object}.
 * @returns {Object}                    - Object to be merged with template variables.
 */
function tableData(table) {
    return {};
}

module.exports = {
    allData: allData,
    dbData: dbData,
    schemaData: schemaData,
    tableData: tableData
};
