'use strict';
const Lab             = require('lab');
const Chai            = require('chai');
const Generator       = require('../index.js');
const path            = require('path');
const fs              = require('fs-extra');
const Knex            = require('knex');

const lab         = exports.lab = Lab.script();
const describe    = lab.describe;
const it          = lab.it;
const testDB      = require('./util/test-db.js');
const expect      = Chai.expect;

let model;
let knex;

lab.before((done) => {
    testDB.createDB(1)
        .then(() => {
            const gen = new Generator({
                logLevel: 'error',
                connection: testDB.credentials,
                templateDir: path.join(__dirname, '../template/objection-alpha'),
                targetDir: path.join(__dirname, 'model-objection'),
                customData: require(path.join(__dirname, 'util/custom-data.js'))
            });

            return gen.writeAll();
        })
        .then(() => {
            const modelFile = './model-objection/index.js';
            knex = new Knex({client: 'pg', connection: { database: testDB.credentials.database, user: testDB.credentials.user,  password: testDB.credentials.password }});
            let models = require(modelFile)

            models.init(knex);
            model = models.model;

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