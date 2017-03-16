// This file is used for providing additional data to templates during generation phase.

function allData(db) {
    return {
        extraAll: db.name
    };
}

function dbData(db) {
    return {
        extra: db.name
    };
}

function schemaData(schema) {
    return {
        extra: schema.name
    };
}

function tableData(table) {
    return {
        extra: table.name
    };
}

module.exports = {
    allData: allData,
    dbData: dbData,
    schemaData: schemaData,
    tableData: tableData
};
