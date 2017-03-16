'use strict';
const Lab       = require('lab');
const Chai      = require('chai');
const Generator = require('../index.js');
const path      = require('path');
const fs        = require('fs-extra');

const lab       = exports.lab = Lab.script();
const describe  = lab.describe;
const it        = lab.it;
const testDB    = require('./util/test-db.js');
const expect    = Chai.expect;

lab.before((done) => {
    testDB.createDB(1)
        .then(() => {
            const gen = new Generator({
                logLevel: 'error',
                connection: testDB.credentials,
                templateDir: path.join(__dirname, 'util/test-template'),
                targetDir: path.join(__dirname, 'model'),
                useEslint: true,
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
        const modelFile   = `./model/${testDB.credentials.database}.js`;
        const model       = require(modelFile);
        expect(model.name).to.equal(testDB.credentials.database);
        done();
    });

    it('should create schema file', (done) => {
        const modelFile   = `./model/schema/public.js`;
        const model       = require(modelFile);
        expect(model.name).to.equal('public');
        done();
    });

    it('should create table files', (done) => {
        const modelFile   = `./model/table/company.js`;
        const model       = require(modelFile);
        expect(model.columns.owner_id.name).to.equal('ownerId');
        done();
    });

    it('should include extra data in table file.', (done) => {
        const modelFile   = `./model/table/company.js`;
        const model       = require(modelFile);
        expect(model.columns.owner_id.extra).to.equal('company');
        expect(model.columns.owner_id.extraAll).to.equal(testDB.credentials.database);
        done();
    });

    it('should include extra data for all files in schema file.', (done) => {
        const modelFile   = `./model/schema/public.js`;
        const model       = require(modelFile);
        expect(model.extra).to.equal('public');
        expect(model.extraAll).to.equal(testDB.credentials.database);
        done();
    });

    it('should include extra data for all files in db file.', (done) => {
        const modelFile   = `./model/${testDB.credentials.database}.js`;
        const model       = require(modelFile);
        expect(model.extra).to.equal(testDB.credentials.database);
        expect(model.extraAll).to.equal(testDB.credentials.database);
        done();
    });
});
