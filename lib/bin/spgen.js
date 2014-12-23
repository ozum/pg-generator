#!/usr/bin/env node

/*jslint node: true */
"use strict";

var program     = require('commander'),
    generator   = require('../index.js'),
    version     = require('../../package.json').version,
    options     = { database: {}, output: {} };

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
    .option('-h, --host [host]',            'IP address or host name of the database server')
    .option('-pr, --port [port]',           'Port of database server to connect')
    .option('-d, --database [database]',    'Database name')
    .option('-u, --user [user]',            'Username to connect to database')
    .option('-p, --password [password]',    'Password to connect to database')
    .option('-s, --schema [schema]',        'Comma separated names of the database schemas. i.e public,extra_schema', list)
    .option('-o, --output [output]',        'Output folder')
    .option('-c, --config [config]',        'Path of the configuration file');

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
if (process.argv.length === 1) { program.help(); }

// Copy all database options to options global variable to override config.
['host', 'port', 'database', 'user', 'password', 'schema'].forEach(function(option) {
    if (program[option] !== undefined) {
        options.database[option] = program[option];
    }
});

// Override output folder if given.
if (program.output !== undefined) {
    options.output.folder = program.output;
}

// Set config file location
if (program.config !== undefined) {
    options.config = program.config;
}


generator(function (err) {
    if (err) { throw err; }
    process.exit(0);
}, options);