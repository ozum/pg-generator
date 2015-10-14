/*jslint node: true, stupid: true, nomen:true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var assert          = require('chai').assert;
var testDB          = require('./util/db.js');
var path            = require('path');
var fs              = require('fs-extra');
var cart, account;


before(function (done) {
    testDB.generate(1, { resetConfig: true, nolog: true, config: path.join(__dirname, 'util', 'config', 'template-sequelize4.json'), output: path.join(__dirname, 'model-sequelize4') }, done);
});

before(function(done) {
    cart    = require('./model-sequelize4/definition-files/public_cart.js');
    account = require('./model-sequelize4/definition-files/public_account.js');
    done();
});
after(function (done) {
    fs.removeSync(path.join(__dirname, 'model-sequelize4'));
    testDB.dropDB(done);
});

describe('cart', function () {
    it('should have model file.', function () {
        assert.isTrue(fs.existsSync(path.join(__dirname, 'model-sequelize4', 'definition-files', 'public_cart.js')));
    });
    it('should have references object.', function () {
        assert.deepEqual(cart.attributes.contactId.references, {
            model: "public.contact",
            key: "contact_id"
        });
    });
});
