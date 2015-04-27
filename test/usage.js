/*jslint node: true, stupid: true, nomen:true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var assert          = require('chai').assert;
var testDB          = require('./util/db.js');
var path            = require('path');
var fs              = require('fs-extra');
var account, contact;



before(function (done) {
    testDB.generate(1, { resetConfig: true, nolog: true, output: path.join(__dirname, 'model') }, done);
});

before(function(done) {
    var orm = require('./model');
    orm.setup(testDB.dbConfig.database, testDB.dbConfig.user, testDB.dbConfig.password, { host: testDB.dbConfig.host, logging: false});
    var sequelize = orm.sequelize;
    account = orm.model('public.account'); // Can be configured without schema.
    contact = orm.model('public.contact'); // Can be configured without schema.
    done();
});

after(function (done) {
    fs.removeSync(path.join(__dirname, 'model'));
    testDB.dropDB(done);
});

describe('public.account', function () {

    // Test one-to-many
    it('should have many primary contacts.', function (done) {
        account.findAll({ include: [ { model: contact, as: "primaryContacts" } ] }).then(function(data) {
            assert.equal(data[0].primaryContacts[0].name, "Özüm");
            done();
        });
    });
});