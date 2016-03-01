#!/usr/bin/env node
'use strict';

try {
    var pg  = require('pg').native;
} catch (err) {
    pg      = require('pg');
}
var program     = require('commander');
var chalk       = require('chalk');
var fs          = require('fs-extra');
var lodash      = require('lodash');
var path        = require('path');
var winston     = require('winston');
var inquirer    = require('inquirer');
var pack        = require('../../package.json');
var Generator   = require('../../index.js');

var templateDir     = path.join(__dirname, '../../template');
var loggerTransport = new (winston.transports.Console)({prettyPrint: true, colorize: true, level: 'info' });
var logger          = new winston.Logger({transports: [loggerTransport]});
var command         = path.basename(process.argv[1]);
var subcommand      = process.argv[2];

var templateNames   = lodash.filter(fs.readdirSync(templateDir), function(file) {
    return fs.statSync(path.join(templateDir, file)).isDirectory();
});

var schemas = [];
var dbClient;

var theme = {
    command: chalk.magenta,
    strong: chalk.yellow,
    danger: chalk.red,
    default: chalk.cyan,
    low: chalk.gray,
    url: chalk.blue
};

program.version(pack.version);

program
    .command('template [name]')
    .option('-l, --list', 'Lists all available builtin templates')
    .option('-t, --target [dir]', 'Where to copy template files.', process.cwd())
    .option('-c, --clear', `${theme.danger('Caution!')} Deletes all files in target directory before copying template files.`)
    .description('Generates one of the builtin templates in target directory.')
    .action((template, options) => {
        if (options.list) {
            console.log(templateNames.join('\n'));
        } else if (!template) {
            templateScenario();
        } else {
            options.template = template;
            generateTemplate(options);
        }
    });

program
    .command('exec [template_dir]')
    .option('-t, --target [dir]',           `Where to put generated files.`)
    .option('-h, --host [host]',            `Host of the database. Default: ${theme.default('localhost')}`, 'localhost')
    .option('    --port [port]',            `Port of the database. Default: ${theme.default('5432')}`, 5432)
    .option('-d, --database [database]',    `Database name`)
    .option('-u, --user [user]',            `Username to connect to database`)
    .option('-p, --password [password]',    `Password to connect to database`)
    .option('-s, --schema [schemas]',       `Comma separated names of the database schemas. i.e public,extra_schema. Default: ${theme.default('public')}`, 'public')
    .option('    --log [level]',            `Log detail level. error|warn|info|verbose|debug. Default: ${theme.default('info')}`, 'info')
    .option('    --extension [extension]',  `File extension of template files. Default: ${theme.default('nunj.html')}`, 'nunj.html')
    .option('    --indent [level]',         `Indent level of generated JS files. Default: ${theme.default(4)}`, 4)
    .option('    --datafile [file]',        `Custom data file which exports simple JS object. Available in templates variable named 'custom'.`)
    .option('    --optionsfile [file]',     `Template options file which exports simple JS object. Available in templates variable named 'options'.`)
    .description('Generates files for given database based on a template.')
    .action((templateDir, options) => {
        options.templateDir = templateDir;
        if (!templateDir) {
            execScenario();
        } else {
            execScenario(options);
        }
    });

program.parse(process.argv);

program.on('--help', function() {
    console.log('  Connects given PostgreSQL database and generates files based on template files.');
    console.log('  To start interactive versions execute commands without parameters.');
    console.log(`  For documentation see ${theme.url('http://www.pg-generator.com')}`);
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ %s template', command);
    console.log('    $ %s exec', command);
    console.log('    $ %s template sequelize -t sequelize', command);
    console.log('    $ %s exec sequelize -d our_crm -u user -p tOpSeCrEt -t model --datafile custom-data.js', command);
    console.log('');
});

// Show help if no arguments are present.
if (process.argv.length === 2) { program.help(); }

function templateScenario() {
    inquirer.prompt([
        { name: 'template', type: 'list', message: 'Template', choices: templateNames },
        { name: 'target', message: 'Target directory', default: (answers) => answers.template },
        { name: 'clear', type: 'confirm', message: `${theme.danger('Caution!')} Clear target directory?`, default: false }
    ], function(answers) {
        logger.info(theme.low('Executing command: ') + scenarioToCommand(answers, 'template'));
        generateTemplate(answers);
    });
}

function execScenario(options) {
    let ask = options ? true : false;
    options = options ? simpleOptions(options) || {} : {};
    inquirer.prompt([
        { name: 'host', message: 'Host', default: 'localhost', when: () => !ask },
        { name: 'port', message: 'Port', default: 5432, validate: (val) => val + 0 === val && val % 1 === 0 ? true : 'Port must be an integer', when: () => !ask },
        { name: 'user', message: 'Username', validate: (val) => val ? true : false, when: () => !options.user },
        { name: 'password', type: 'password', message: 'Password', validate: function(input, answers) { connectDB(input, lodash.defaultsDeep({}, options, answers), this.async()); }, when: () => !options.password },
        { name: 'database', type: 'list', message: 'Database', choices: function(answers) { getDatabases(lodash.defaultsDeep({}, options, answers), this.async()); }, when: () => !options.database },
        { name: 'schema', type: 'checkbox', message: 'Schemas', default: schemas, choices: getSchemas, when: () => !options.schema },
        { name: 'templateDir', message: 'Template directory', validate: (val) => val && fileExists(val, true) ? true : 'Template directory does not exists', when: () => !options.templateDir },
        { name: 'target', message: 'Target directory', validate: (val) => val ? true : false, when: () => !options.target },
        { name: 'log', type: 'list', message: 'Log Level', choices: ['error', 'warn', 'info', 'verbose', 'debug'], default: 'info', when: () => !ask },
        { name: 'extension', message: 'File Extension', default: 'nunj.html', when: () => !ask },
        { name: 'indent', type: 'list', message: 'Indent', choices: ['1', '2', '4'], default: '4', when: () => !ask },
        { name: 'datafile', message: 'Custom data file', validate: (val) => fileExists(val) ? true : 'File does not exists', when: () => !ask },
        { name: 'optionsfile', message: 'Template options file', validate: (val) => fileExists(val) ? true : 'File does not exists', when: () => !ask }
    ], function(answers) {
        if (dbClient) { dbClient.end(); }
        answers = lodash.defaultsDeep({}, options, answers);
        logger.info(theme.low('Executing command: ') + scenarioToCommand(answers, 'templateDir'));
        generateFiles(answers);
    });
}

/**
 * Converts options object generated by commander module to simple key/value pairs object.
 * @param {Object} options  - Object created by commander module.
 * @returns {Object}        - Simplified options object.
 */
function simpleOptions(options) {
    let simpleOptions = {};
    let keys = ['host', 'port', 'user', 'password', 'database', 'schema', 'templateDir', 'target', 'log', 'extension', 'indent', 'datafile', 'optionsfile'];

    for (let key of keys) {
        simpleOptions[key] = options[key];
    }

    return simpleOptions;
}

function scenarioToCommand(answers, commandParam) {
    let result = `${command} ${subcommand} ${answers[commandParam]} `;
    for (let option in answers) {
        if (answers.hasOwnProperty(option)) {
            if (option === commandParam || option === 'password' || !answers[option]) { continue; }
            let answer = typeof answers[option] === 'boolean' ? '' : `${answers[option]} `;
            result += `--${option} ${answer}`;
        }
    }
    return result;
}

function fileExists(file, shouldDirectory) {
    var stat;
    file = path.resolve(file);

    try { stat = fs.statSync(file); }
    catch (err) {
        if (err.code === 'ENOENT') { return false; }
    }

    if (shouldDirectory && stat.isDirectory) { return true; }
    return (!shouldDirectory && stat.isFile);
}

function error(message) {
    logger.error(message);
    process.exit(5);
}

function generateTemplate(options) {
    if (templateNames.indexOf(options.template) === -1) {
        error(`${theme.strong(options.template)} template cannot be found. See available templates with ${command} ${subcommand} -l`);
    }
    options.target = path.resolve(options.target);

    if (!options.clear && fileExists(options.target, true) && fs.readdirSync(options.target).length > 0) {
        error(`Target directory is not empty. Use ${theme.command('-c')} or ${theme.command('--clear')} option to delete contents of the target directory.`);
    }

    if (options.clear) { fs.emptyDirSync(options.target); }

    fs.copy(path.join(templateDir, options.template), options.target, (err) => {
        if (err) { error(err); }
        logger.info(`${options.template} template is successfully created at ${options.target}.`);
    });
}

function generateFiles(options) {
    let templateOptions;
    let customData;

    if (options.optionsfile && !fileExists(options.optionsfile)) { error(`Template options file '${options.optionsfile}' does not exists.`); }
    if (options.datafile && !fileExists(options.datafile)) { error(`Custom data file '${options.datafile}' does not exists.`); }
    if (!fileExists(options.templateDir, true)) { error(`Template directory '${options.templateDir}' does not exists.`); }
    if (!(options.host || options.port || options.database || options.user || options.password || options.schema || options.target)) {
        error('Host, port, database, user, password, schema and target directory are required.');
    }

    if (options.optionsfile) {
        templateOptions = require(path.resolve(options.optionsfile));
    }

    if (options.datafile) {
        customData = require(path.resolve(options.datafile));
    }

    var generator = new Generator({
        connection: { host: options.host, port: options.port, database: options.database, user: options.user, password: options.password },
        schemas: Array.isArray(options.schema) ? options.schema : options.schema.split(','),
        templateDir: path.resolve(options.templateDir),
        targetDir: path.resolve(options.target),
        logLevel: options.log,
        fileExtension: options.extension,
        indent: options.indent,
        customData: customData,
        templateOptions: templateOptions
    });

    generator.writeAll().catch((err) => {
        error(err.stack);
    });
}

function connectDB(input, answers, callback) {
    let done = callback || this.async();
    if (input) { answers.password = input; }
    if (dbClient) { dbClient.end(); }
    dbClient = new pg.Client({host: answers.host, port: answers.port, user: answers.user, password: answers.password, database: answers.database || 'template1'});
    dbClient.connect((err) => {
        if (err) {
            let regexp = new RegExp('^.+?:\\s*');
            let message = err.message.replace(regexp, '').replace(/\n/g, '');
            message = message.charAt(0).toUpperCase() + message.slice(1);
            return done(message);
        }
        return done(true);
    });
}

function getDatabases(answers, callback) {
    var done = callback || this.async();
    let databases = [];

    let db = function() {
        let query = dbClient.query("SELECT datname FROM pg_database WHERE datistemplate = false AND datname <> 'postgres' ORDER BY datname;");
        query.on('row', (row) => databases.push(row.datname));
        query.on('end', () => done(databases));
        query.on('error', (err) => error(err.message));
    };

    if (!dbClient) {
        console.log(answers);
        connectDB(null, answers, db);
    } else {
        process.nextTick(db);
    }
}

function getSchemas(answers) {
    var done = this.async();
    let exclude = {'information_schema': true, 'pg_catalog': true};

    connectDB(null, answers, function(result) {
        if (!result) { return done; }
    });

    let query = dbClient.query('SELECT schema_name AS "schemaName" FROM information_schema.schemata ORDER BY schema_name;');
    query.on('row', (row) => {
        if (exclude[row.schemaName] || row.schemaName.startsWith('pg_toast') || row.schemaName.startsWith('pg_temp')) {
            return;
        }

        schemas.push(row.schemaName);
    });
    query.on('end', () => done(schemas));
    query.on('error', (err) => error(err.message));
}
