'use strict';

var sequelizeType   = require('./util/sequelize-types');

/**
 * Returns an array of all tables related to this table. Duplicates are removed, so every related table in the result array is unique.
 * @param {pgStructure.table}           table   - {@link http://www.pg-structure.com/api/Table/ pg-structure table} to search related tables for.
 * @returns {Array.<pgStructure.table>}         - List of related tables.
 */
function uniqueRelatedTables(table) {
    let visited = {};
    let result = [];
    visited[table.name] = true;

    table.relations.forEach((relation) => {
        let tableName = relation.targetTable.name;
        if (visited[tableName]) { return; }
        visited[tableName] = true;
        result.push(relation.targetTable);
    });


    return result;
}

function allData(db) {
    let data = { util : {} };
    data.util.uniqueRelatedTables = uniqueRelatedTables;
    data.util.sequelizeType = sequelizeType;
    return data;
}

function dbData(db) {
    return {};
}

function schemaData(schema) {
    return {};
}

function tableData(table) {
    return {};
}

module.exports = {
    allData: allData,
    dbData: dbData,
    schemaData: schemaData,
    tableData: tableData
};