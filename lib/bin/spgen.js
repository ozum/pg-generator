#!/usr/bin/env node

/*jslint node: true */
"use strict";

var program     = require('commander'),
    generator   = require('../index.js'),
    version     = require('../../package.json').version,
    options     = {};

/**
 * Parses CSV and returns as a list.
 * @private
 * @param {string} val - CSV values.
 * @returns {Array}
 */
function list(val) {
    return val.split(',');
}


// Define options, help text
program
    .version(version)
    .option('-h, --host [host]',                'IP address or host name of the database server')
    .option('    --port [port]',                'Port of database server to connect')
    .option('-d, --database [database]',        'Database name')
    .option('-u, --user [user]',                'Username to connect to database')
    .option('-p, --password [password]',        'Password to connect to database')
    .option('-s, --schema [schema]',            'Comma separated names of the database schemas. i.e public,extra_schema', list)
    .option('-o, --output [output]',            'Output folder')
    .option('-c, --config [config]',            'Path of the configuration file')
    .option('-t  --templateName [templateName]','Use builtin template folder with given name. (default|sequelize4)')
    .option('    --nolog',                      'No log output')
    .option('    --resetConfig',                'Reset configuration. (Side-step. Not for production.)')
    .option('    --throwError',                 'Instead of logging errors to console, throws error.')
;

program.on('--help', function(){
    console.log('  Connects given PostgreSQL database and generates Sequelize models');
    console.log('  automatically. Can be customized via node-config.');
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ %s -h 127.0.0.1 -d our_crm -u george -p topSeCRet -s public,extra -o ./model', process.argv[0]);
    console.log('    $ %s -c ../config/default.json -u natalie -p topSecret', process.argv[0]);
    console.log('');
});

program.parse(process.argv);

// Show help if no arguments are present.
if (process.argv.length === 2) { program.help(); }

// Copy all options to options global variable to override config.
['host', 'port', 'database', 'user', 'password', 'schema', 'output', 'config', 'templateName', 'nolog', 'resetConfig', 'throwError'].forEach(
    function(option) {
        if (program[option] !== undefined) {
            options[option] = program[option];
        }
    }
);

if (program.templateName === undefined) {
    console.warn(
        '\n********************************************************************************************\n' +
        'DEPRECIATION WARNING:\n' +
        'You should use either use -t or provide a template folder in your configuration.\n' +
        'Default value for template folder will be not provided to support future Sequelize versions.\n' +
        '********************************************************************************************\n'
    );
}

generator(function (err) {
    if (err) {
        if ( options.throwError ) {
            throw(err);
        } else {
            console.log(err);
        }
    }
    process.exit(0);
}, options);