const PgTestUtil  = require('pg-test-util');
const path        = require('path');
const config      = require('./test-config.json').development;

const db = config.database;

const dbOptions = {
    host: config.host,
    port: config.port,
    user: config.user || config.username, // sequelize configs use 'username', not 'user'
    password: config.password,
    defaultDatabase: db
};

const pgUtil = new PgTestUtil(dbOptions);

const createDB = function createDB(code) {
    return pgUtil.createDB(db, { drop: false })
        .then(() => { return pgUtil.executeSQLFile(path.join(__dirname, `db-${code}.sql`)); })
        .then(() => { return pgUtil.executeSQLFile(path.join(__dirname, `data-${code}.sql`)); })
        .catch((err) => { console.log(err); });
};

const dropDB = function dropDB() {
    return pgUtil.dropDB(db);
};

module.exports = {
    createDB: createDB,
    dropDB: dropDB,
    credentials: { database: db, user: dbOptions.user, password: dbOptions.password, host: dbOptions.host, port: dbOptions.port }
};
