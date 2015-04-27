/*jslint node: true, nomen: true, stupid: true */
"use strict";

var fs              = require('fs');
var path            = require('path');
var pg              = require('pg');
var async           = require('async');
var lodash          = require('lodash');
var dbConfig        = { host: 'localhost', port: 5432, user: 'user', password: 'password', database: 'pg_generator_test_625393' };
var generator       = require('../../lib/index.js');

var conString           = 'postgres://' + dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/'; //'postgres://user:pass@host:port/'
var conStringTest       = conString + dbConfig.database;                                                                //'postgres://user:pass@host:port/db'
var conStringTemplate   = conString + 'template1';                                                                      //'postgres://user:pass@host:port/db'

var sql = {
    createDB        : "CREATE DATABASE pg_generator_test_625393 WITH ENCODING = 'UTF8' TEMPLATE = template0;",
    dropDB          : "DROP DATABASE IF EXISTS pg_generator_test_625393;",
    createSchema    : function (sqlID) { return fs.readFileSync(path.join(__dirname, 'create-test-db-' + sqlID  + '.sql')).toString(); },
    dropConnection  : "SELECT pg_terminate_backend(pid) FROM pg_stat_activity where datname='pg_generator_test_625393';"
};

pg.on('error', function (err) {
    // Do nothing on termination due to admin command. We do this to drop previously created test db.
    if (!err.message.match('terminating connection due to administrator command')) { console.log('Database error!', err); }
});

module.exports.dbConfig = dbConfig;

module.exports.generate = function generate(sqlId, options, callback) {
    module.exports.resetDB(sqlId, function () {
        generator(function (err) {
            if (err) { callback(err); return; }
            callback();
        }, lodash.defaults(options, {
            database: 'pg_generator_test_625393',
            user: dbConfig.user,
            password: dbConfig.password,
            output: path.join(__dirname, '..', 'model'),
            schema: ['public', 'other_schema'],
            nolog: true
        }));
    });
};

module.exports.resetDB = function resetDB(sqlID, callback) {
    if (sqlID === undefined) { sqlID = 1; }
    var client = new pg.Client(conStringTemplate);

    client.connect(function () {
        async.series([
            client.query.bind(client, sql.dropConnection),
            client.query.bind(client, sql.dropDB),
            client.query.bind(client, sql.createDB),
            function (next) {
                var clientTest = new pg.Client(conStringTest);
                clientTest.connect(function () {
                    clientTest.query(sql.createSchema(sqlID), function () {
                        clientTest.end();
                        next();
                    });
                });
            }
        ], function (err) {
            if (err) { throw err; }
            client.end();
            callback();
        });
    });
};

module.exports.dropDB = function dropDB(callback) {
    var client = new pg.Client(conStringTemplate);

    client.connect(function () {
        async.series([
            client.query.bind(client, sql.dropConnection),
            client.query.bind(client, sql.dropDB)
        ], function (err) {
            if (err) { throw err; }
            client.end();
            callback();
        });
    });
};

module.exports.dbConfig = dbConfig;