'use strict';
const Lab             = require('lab');
const Chai            = require('chai');
const Generator       = require('../index.js');
const path            = require('path');
const fs              = require('fs-extra');

const lab         = exports.lab = Lab.script();
const describe    = lab.describe;
const it          = lab.it;
const testDB      = require('./util/test-db.js');
const expect      = Chai.expect;

const Sequelize   = require('sequelize');
const sequelize   = new Sequelize(testDB.credentials.database, testDB.credentials.user,  testDB.credentials.password, { dialect: 'postgres', logging: false });

const exec        = require('mz/child_process').exec;

let model;

const targetDir = path.join(__dirname, 'model-sequelize-2');

lab.before((done) => {
    testDB.createDB(1)
        .then(() => {
            let cmd = `node ${path.join(__dirname, '../lib/bin/pgen.js')} exec template/sequelize --host ${testDB.credentials.host} `;
            cmd    += `--port ${testDB.credentials.port} --database ${testDB.credentials.database} --user ${testDB.credentials.user} `;
            cmd    += `--password ${testDB.credentials.password} --target ${targetDir} --log error --fix `;
            cmd    += `--datafile ${path.join(__dirname, 'util/custom-data.js')} `;
            return exec(cmd);
        })
        .then(() => {
            const modelFile = path.join(targetDir, 'index.js');
            model = require(modelFile).init(sequelize);
            done();
        })
        .catch((err) => { throw err; });
});

lab.after((done) => {
    testDB.dropDB().then(() => {
        fs.removeSync(targetDir);
        done();
    });
});

describe('Cart model file', () => {
    it ('should equal expected result.', (done) => {
        const source      = fs.readFileSync(path.join(targetDir, 'definition/cart.js')).toString();
        const expected    = fs.readFileSync(path.join(__dirname, 'util/expected/cart.js')).toString();
        expect(source).to.equal(expected);
        done();
    });
});

describe('Cart model file', () => {
    it ('should equal expected result.', (done) => {
        const source      = fs.readFileSync(path.join(targetDir, '/definition/company.js')).toString();
        const expected    = fs.readFileSync(path.join(__dirname, 'util/expected/company.js')).toString();
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
