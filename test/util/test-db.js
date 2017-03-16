const PgTestUtil  = require('pg-test-util');
const path        = require('path');

const db = 'pg-generator-test-7348G63';

const dbOptions = {
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: 'password',
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
