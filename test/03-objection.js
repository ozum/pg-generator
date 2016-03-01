'use strict';
var Lab             = require('lab');
var Chai            = require('chai');
var Generator       = require('../index.js');
var path            = require('path');
var fs              = require('fs-extra');
var Knex            = require('knex');

var lab         = exports.lab = Lab.script();
var describe    = lab.describe;
var it          = lab.it;
var testDB      = require('./util/test-db.js');
var expect      = Chai.expect;

var model;
var knex;

lab.before((done) => {
    testDB.createDB(1)
        .then(() => {
            var gen = new Generator({
                logLevel: 'error',
                connection: testDB.credentials,
                templateDir: path.join(__dirname, '../template/objection-alpha'),
                targetDir: path.join(__dirname, 'model-objection'),
                customData: require(path.join(__dirname, 'util/custom-data.js'))
            });

            return gen.writeAll();
        })
        .then(() => {
            let modelFile = './model-objection/index.js';
            knex = new Knex({client: 'pg', connection: { database: testDB.credentials.database, user: testDB.credentials.user,  password: testDB.credentials.password }});
            model = require(modelFile).init(knex);
            done();
        })
        .catch(done);
});

lab.after((done) => {
    testDB.dropDB()
        .then(() => knex.destroy)
        .then(() => {
            fs.removeSync(path.join(__dirname, 'model-objection'));
            done();
        });
});

describe('Company Instance', () => {
    it ('should have a name', (done) => {
        model.Company.query()
            .then(function(companies) {
                expect(companies[0].name).to.equal('Acmesai');
                done();
            })
            .catch(done);
    });
});