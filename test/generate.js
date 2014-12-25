/*jslint node: true, stupid: true, nomen:true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var assert          = require('chai').assert;
var testDB          = require('./util/db.js');
var path            = require('path');
var fs              = require('fs-extra');
var cart, account;

before(function (done) {
    testDB.generate(1, { resetConfig: true, nolog: true, output: path.join(__dirname, 'model') }, done);
});

before(function(done) {
    cart    = require('./model/definition-files/public_cart.js');
    account = require('./model/definition-files/public_account.js');
    done();
});

after(function (done) {
    fs.removeSync(path.join(__dirname, 'model'));
    testDB.dropDB(done);
});

describe('public.cart', function () {

    it('should have model file.', function () {
        assert.isTrue(fs.existsSync(path.join(__dirname, 'model', 'definition-files', 'public_cart.js')));
    });
    it('should have model name.', function () {
        assert.equal(cart.modelName, 'public.cart');
    });
    it('should have createdAt attribute.', function () {
        assert.equal(cart.attributes.createdAt.field, 'created_at');
    });
    it('should have relations.', function () {
        assert.equal(cart.relations.length, 3);
    });
});

describe('public.account', function () {
    it('should have relation to other_schema.', function () {
        var found = false;
        account.relations.forEach(function (relation) {
            if (relation.model === 'otherSchema.otherSchemaTable') {
                found = true;
            }
            assert.isTrue(found);
        });
    });
});