'use strict';
var Lab             = require('lab');
var Chai            = require('chai');
var Generator       = require('../index.js');
var path            = require('path');
var fs              = require('fs-extra');

var lab         = exports.lab = Lab.script();
var describe    = lab.describe;
var it          = lab.it;
var testDB      = require('./util/test-db.js');
var expect      = Chai.expect;

lab.before((done) => {
    testDB.createDB(1)
        .then(() => {
            var gen = new Generator({
                logLevel: 'error',
                connection: testDB.credentials,
                templateDir: path.join(__dirname, 'util/test-template'),
                targetDir: path.join(__dirname, 'model')
            });

            return gen.writeAll();
        })
        .then(done)
        .catch(done);
});

lab.after((done) => {
    testDB.dropDB().then(() => {
        fs.removeSync(path.join(__dirname, 'model'));
        done();
    });
});

describe('Generator', () => {
    it('should create db file', (done) => {
        let modelFile   = `./model/${testDB.credentials.database}.js`;
        let model       = require(modelFile);
        expect(model.name).to.equal(testDB.credentials.database);
        done();
    });

    it('should create schema file', (done) => {
        let modelFile   = `./model/schema/public.js`;
        let model       = require(modelFile);
        expect(model.name).to.equal('public');
        done();
    });

    it('should create table files', (done) => {
        let modelFile   = `./model/table/company.js`;
        let model       = require(modelFile);
        expect(model.columns.owner_id.name).to.equal('ownerId');
        done();
    });

    it('should include extra data in table file.', (done) => {
        let modelFile   = `./model/table/company.js`;
        let model       = require(modelFile);
        expect(model.columns.owner_id.extra).to.equal('company');
        expect(model.columns.owner_id.extraAll).to.equal(testDB.credentials.database);
        done();
    });

    it('should include extra data for all files in schema file.', (done) => {
        let modelFile   = `./model/schema/public.js`;
        let model       = require(modelFile);
        expect(model.extra).to.equal('public');
        expect(model.extraAll).to.equal(testDB.credentials.database);
        done();
    });

    it('should include extra data for all files in db file.', (done) => {
        let modelFile   = `./model/${testDB.credentials.database}.js`;
        let model       = require(modelFile);
        expect(model.extra).to.equal(testDB.credentials.database);
        expect(model.extraAll).to.equal(testDB.credentials.database);
        done();
    });
});
