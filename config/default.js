/*jslint node: true, nomen: true*/
"use strict";

var path = require('path');

module.exports = {
    "sequelize-pg-generator": {
        "database": {
            "host": "127.0.0.1",
            "port": 5432,
            "user": "user",
            "password": "password",
            "database": "",
            "schema": ["public"]
        },
        "template": {
            "engine": "swig",
            "extension": "html",
            "folder": path.join(__dirname, '..', 'template')
        },
        "output": {
            "log": true,
            "folder": "./model",
            "beautify": true,
            "indent": 4,
            "preserveNewLines": false,
            "warning": true
        },
        "generate": {
            "stripFirstTableFromHasMany": true,
            "hasManyThrough": false,
            "belongsToMany": true,
            "prefixForBelongsTo": "related",
            "useSchemaName": true,
            "modelCamelCase": true,
            "relationAccessorCamelCase": true,
            "columnAccessorCamelCase": true,
            "columnDefault": true,
            "columnDescription": true,
            "columnAutoIncrement": true,
            "tableDescription": true,
            "dataTypeVariable": "Seq",
            "skipTable": []
        },
        "generateOverride": {
            "contact": {
                "tableDescription": false
            }
        },
        "tableOptions": {
            "timestamps": false,
            "camelCase": true,
            "paranoid": false
        },
        "tableOptionsOverride": {
            "contact": {
                "paranoid": true
            }
        }
    }
};
