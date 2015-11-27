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
    return {
        messageAll: 'This message is from index.js#allData() and available every template of "' + db.name + '".'
    };
}

/**
 * Object returned from this function will be merged with template variables and available in templates located in
 * db directory. This function is executed for each generated file resulted from templates in db directory.
 * @param {pgStructure.db}  db  - {@link http://www.pg-structure.com/api/DB/ pg-structure db object}.
 * @returns {Object}            - Object to be merged with template variables.
 */
function dbData(db) {
    return {
        message: 'This message is from index.js#dbData() and available templates from db directory of "' + db.name + '".'
    };
}

/**
 * Object returned from this function will be merged with template variables and available in templates located in
 * schema directory. This function is executed for each generated file resulted from templates in schema directory.
 * @param {pgStructure.schema}  schema  - {@link http://www.pg-structure.com/api/Schema/ pg-structure schema object}.
 * @returns {Object}                    - Object to be merged with template variables.
 */
function schemaData(schema) {
    return {
        message: 'This message is from index.js#schemaData() and available templates from schema directory. Function is executed for "' + schema.name + '" schema.'
    };
}

/**
 * Object returned from this function will be merged with template variables and available in templates located in
 * table directory. This function is executed for each generated file resulted from templates in table directory.
 * @param {pgStructure.table}  table    - {@link http://www.pg-structure.com/api/Table/ pg-structure table object}.
 * @returns {Object}                    - Object to be merged with template variables.
 */
function tableData(table) {
    return {
        message: 'This message is from index.js#tableData() and available templates from table directory. Function is executed for "' + table.name + '" table.'
    };
}

module.exports = {
    allData: allData,
    dbData: dbData,
    schemaData: schemaData,
    tableData: tableData
};
