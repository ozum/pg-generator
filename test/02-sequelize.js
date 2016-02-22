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

var Sequelize   = require('sequelize');
var sequelize   = new Sequelize(testDB.credentials.database, testDB.credentials.user,  testDB.credentials.password, { dialect: 'postgres', logging: false });

var model;

lab.before((done) => {
    testDB.createDB(1)
        .then(() => {
            var gen = new Generator({
                logLevel: 'error',
                connection: testDB.credentials,
                templateDir: path.join(__dirname, '../template/sequelize'),
                targetDir: path.join(__dirname, 'model'),
                customData: require(path.join(__dirname, 'util/custom-data.js'))
            });

            return gen.writeAll();
        })
        .then(() => {
            let modelFile = './model/index.js';
            model = require(modelFile).init(sequelize);
            done();
        })
        .catch(done);
});

lab.after((done) => {
    testDB.dropDB().then(() => {
        fs.removeSync(path.join(__dirname, 'model'));
        done();
    });
});

describe('Cart model file', () => {
    it ('should equal expected result.', (done) => {
        let source      = fs.readFileSync(path.join(__dirname, 'model/definition/cart.js')).toString();
        let expected    = fs.readFileSync(path.join(__dirname, 'util/expected/cart.js')).toString();
        expect(source).to.equal(expected);
        done();
    });
});

describe('Cart model file', () => {
    it ('should equal expected result.', (done) => {
        let source      = fs.readFileSync(path.join(__dirname, 'model/definition/company.js')).toString();
        let expected    = fs.readFileSync(path.join(__dirname, 'util/expected/company.js')).toString();
        expect(source).to.equal(expected);
        done();
    });
});

describe('Company Instance', () => {
    it ('should have a name', (done) => {
        model.Company.findOne({ where: {id: 1} })
            .then(function(company) {
                expect(company.name).to.equal('Acmesai');
                done();
            })
            .catch(done);
    });
});