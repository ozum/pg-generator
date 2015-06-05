/*jslint node: true, stupid: true, nomen:true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var assert          = require('chai').assert;
var testDB          = require('./util/db.js');
var path            = require('path');
var fs              = require('fs-extra');
var cart, account;


before(function (done) {
    testDB.generate(1, { resetConfig: true, nolog: true, config: path.join(__dirname, 'util', 'config', 'reverse-config.json'), output: path.join(__dirname, 'model-different') }, done);
});

before(function(done) {
    cart    = require('./model-different/definition-files/cart.js');
    account = require('./model-different/definition-files/account.js');
    done();
});
after(function (done) {
    fs.removeSync(path.join(__dirname, 'model-different'));
    testDB.dropDB(done);
});

describe('cart', function () {
    it('should have model file.', function () {
        assert.isTrue(fs.existsSync(path.join(__dirname, 'model-different', 'definition-files', 'cart.js')));
    });
    it('should have model name.', function () {
        assert.equal(cart.modelName, 'cart');
    });
    it('should have createdAt attribute.', function () {
        assert.equal(cart.attributes.created_at.field, 'created_at');
    });
    it('should have relations.', function () {
        assert.equal(cart.relations.length, 3);
    });
});

describe('account', function () {
    it('should not have relation to other_schema.', function () {
        var found = false;
        account.relations.forEach(function (relation) {
            if (relation.model === 'otherSchema.otherSchemaTable') {
                found = true;
            }
            assert.isFalse(found);
        });
    });
    it('should have true as default value for is_active', function() {
        assert.equal(account.attributes.is_active.defaultValue, true);
    });
    it('should have false as default value for def_false', function() {
        assert.equal(account.attributes.def_false.defaultValue, false);
    });
});
