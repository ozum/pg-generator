#!/usr/bin/env node

/*  eslint no-console: "off", max-len: "off", no-use-before-define: "off" */

const pg          = require('pg');
const program     = require('commander');
const chalk       = require('chalk');
const fs          = require('fs-extra');
const lodash      = require('lodash');
const path        = require('path');
const winston     = require('winston');
const inquirer    = require('inquirer');
const pack        = require('../../package.json');
const Generator   = require('../../index.js');

const templateDir     = path.join(__dirname, '../../template');
const loggerTransport = new (winston.transports.Console)({ prettyPrint: true, colorize: true, level: 'info' });
const logger          = new winston.Logger({ transports: [loggerTransport] });
const command         = path.basename(process.argv[1]);
const subcommand      = process.argv[2];

const templateNames   = lodash.filter(fs.readdirSync(templateDir), file => fs.statSync(path.join(templateDir, file)).isDirectory());

const schemas = [];
let dbClient;

const theme = {
  command: chalk.magenta,
  strong:  chalk.yellow,
  danger:  chalk.red,
  default: chalk.cyan,
  low:     chalk.gray,
  url:     chalk.blue,
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
      console.info(templateNames.join('\n'));
    } else if (!template) {
      templateScenario();
    } else {
      options.template = template;
      generateTemplate(options);
    }
  });

program
  .command('exec [template_dir]')
  .option('-f, --fix',                    `Whether to execute linter --fix for generated files.`)
  .option('-t, --target [dir]',           'Where to put generated files.')
  .option('-h, --host [host]',            `Host of the database. Default: ${theme.default('localhost')}`, 'localhost')
  .option('    --port [port]',            `Port of the database. Default: ${theme.default('5432')}`, 5432)
  .option('-d, --database [database]',    'Database name')
  .option('-u, --user [user]',            'Username to connect to database')
  .option('-p, --password [password]',    'Password to connect to database')
  .option('-s, --schema [schemas]',       `Comma separated names of the database schemas. i.e public,extra_schema. Default: ${theme.default('public')}`, 'public')
  .option('    --ssl',                    'Adds ssl=true option to conection.')
  .option('    --log [level]',            `Log detail level. error|warn|info|verbose|debug. Default: ${theme.default('info')}`, 'info')
  .option('    --extension [extension]',  `File extension of template files. Default: ${theme.default('nunj.html')}`, 'nunj.html')
  .option('    --indent [level]',         `Indent level of generated JS files. Default: ${theme.default(4)}`, 4)
  .option('    --datafile [file]',        'Custom data file which exports simple JS object. Available in templates variable named \'custom\'.')
  .option('    --optionsfile [file]',     'Template options file which exports simple JS object. Available in templates variable named \'options\'.')
  .option('    --nobeautifier',           'Prevents output files to be filtered by beautifier.')
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

program.on('--help', () => {
  console.info('  Connects given PostgreSQL database and generates files based on template files.');
  console.info('  To start interactive versions execute commands without parameters.');
  console.info(`  For documentation see ${theme.url('http://www.pg-generator.com')}`);
  console.info('');
  console.info('  Examples:');
  console.info('');
  console.info('    $ %s template', command);
  console.info('    $ %s exec', command);
  console.info('    $ %s template sequelize -t sequelize', command);
  console.info('    $ %s exec sequelize -d our_crm -u user -p tOpSeCrEt -t model --datafile custom-data.js', command);
  console.info('');
  console.info('  You can get further help on individual commands by providing option --help after the command');
  console.info('');
  console.info('  Example:');
  console.info('');
  console.info('    $ %s exec --help', command);
  console.info('');
});

// Show help if no arguments are present.
if (process.argv.length === 2) {
  program.help();
}

function templateScenario() {
  inquirer.prompt([
        { name: 'template', type: 'list', message: 'Template', choices: templateNames },
        { name: 'target', message: 'Target directory', default: answers => answers.template },
        { name: 'clear', type: 'confirm', message: `${theme.danger('Caution!')} Clear target directory?`, default: false },
  ], (answers) => {
    logger.info(theme.low('Executing command: ') + scenarioToCommand(answers, 'template'));
    generateTemplate(answers);
  });
}

function execScenario(options) {
  const ask = !!options;
  options = options ? convertToSimpleOptions(options) || {} : {};

  inquirer.prompt([
        { name: 'host', message: 'Host', default: 'localhost', when: () => !ask },
        { name: 'port', message: 'Port', default: 5432, validate: val => val + 0 === val && val % 1 === 0 ? true : 'Port must be an integer', when: () => !ask },
        { name: 'user', message: 'Username', validate: val => !!val, when: () => !options.user },
        { name: 'password', type: 'password', message: 'Password', validate(input, answers) { connectDB(input, lodash.defaultsDeep({}, options, answers), this.async()); }, when: () => !options.password },
        { name: 'database', type: 'list', message: 'Database', choices(answers) { getDatabases(lodash.defaultsDeep({}, options, answers), this.async()); }, when: () => !options.database },
        { name: 'schema', type: 'checkbox', message: 'Schemas', default: schemas, choices: getSchemas, when: () => !options.schema },
        { name: 'ssl', type: 'confirm', message: 'Use SSL/TLS to connect to server', default: false, when: () => !ask },
        { name: 'templateDir', message: 'Template directory', validate: val => val && fileExists(val, true) ? true : 'Template directory does not exists', when: () => !options.templateDir },
        { name: 'target', message: 'Target directory', validate: val => !!val, when: () => !options.target },
        { name: 'log', type: 'list', message: 'Log Level', choices: ['error', 'warn', 'info', 'verbose', 'debug'], default: 'info', when: () => !ask },
        { name: 'extension', message: 'File Extension', default: 'nunj.html', when: () => !ask },
        { name: 'indent', type: 'list', message: 'Indent', choices: ['1', '2', '4'], default: '4', when: () => !ask },
        { name: 'datafile', message: 'Custom data file', validate: val => fileExists(val) ? true : 'File does not exists', when: () => !ask },
        { name: 'optionsfile', message: 'Template options file', validate: val => fileExists(val) ? true : 'File does not exists', when: () => !ask },
        { name: 'fix', type: 'confirm', message: 'Use linter --fix', default: true, when: () => !ask },
        { name: 'nobeautifier', type: 'confirm', message: 'Prevent beautifier', default: false, when: () => !ask },

  ], (answers) => {
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
function convertToSimpleOptions(options) {
  const simpleOptions = {};
  const keys = ['host', 'port', 'user', 'password', 'database', 'schema', 'templateDir', 'target', 'log', 'extension', 'indent', 'datafile', 'optionsfile', 'nobeautifier', 'fix', 'ssl'];

  for (const key of keys) {
    simpleOptions[key] = options[key];
  }

  return simpleOptions;
}


function scenarioToCommand(answers, commandParam) {
  let result = `${command} ${subcommand} ${answers[commandParam]} `;
  for (const option in answers) {
    if (answers.hasOwnProperty(option)) {
      if (option === commandParam || option === 'password' || !answers[option]) { continue; }
      const answer = typeof answers[option] === 'boolean' ? '' : `${answers[option]} `;
      result += `--${option} ${answer}`;
    }
  }
  return result;
}

function fileExists(file, shouldDirectory) {
  let stat;
  file = path.resolve(file);

  try { stat = fs.statSync(file); }    catch (err) {
    if (err.code === 'ENOENT') { return false; }
  }

  if (shouldDirectory && stat.isDirectory) { return true; }
  return (!shouldDirectory && stat.isFile);
}

function error(message) {
  logger.error(message);
  process.exit(5);
}

function success(message) {
  logger.info(message);
  process.exit(0);
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
    success(`${options.template} template is successfully created at ${options.target}.`);
  });
}

function generateFiles(options) {
  let templateOptions;
  let customData;

  if (options.optionsfile && !fileExists(options.optionsfile)) {
    error(`Template options file '${options.optionsfile}' does not exists.`);
  }
  if (options.datafile && !fileExists(options.datafile)) {
    error(`Custom data file '${options.datafile}' does not exists.`);
  }
  if (!fileExists(options.templateDir, true)) {
    error(`Template directory '${options.templateDir}' does not exists.`);
  }
  if (!(options.host || options.port || options.database || options.user || options.password || options.schema || options.target)) {
    error('Host, port, database, user, password, schema and target directory are required.');
  }

  if (options.optionsfile) {
    templateOptions = require(path.resolve(options.optionsfile));
  }

  if (options.datafile) {
    customData = require(path.resolve(options.datafile));
  }

  const generator = new Generator({
    connection:    { host: options.host, port: options.port, database: options.database, user: options.user, password: options.password, ssl: options.ssl },
    schemas:       Array.isArray(options.schema) ? options.schema : options.schema.split(','),
    templateDir:   path.resolve(options.templateDir),
    targetDir:     path.resolve(options.target),
    logLevel:      options.log,
    fileExtension: options.extension,
    indent:        options.indent,
    customData,
    templateOptions,
    beautifier:    !options.nobeautifier,
    lintFix:       options.fix,
  });

  generator.writeAll().then(() => {
    success('Successfully generated files.');
  }).catch((err) => {
    error(err.stack);
  });
}

function connectDB(input, answers, callback) {
  const done = callback || this.async();
  answers.password = input || answers.password;

  if (dbClient) {
    dbClient.end();
  }

  dbClient = new pg.Client({ host: answers.host, port: answers.port, user: answers.user, password: answers.password, database: answers.database || 'template1' });
  dbClient.connect((err) => {
    if (err) {
      const regexp = new RegExp('^.+?:\\s*');
      let message = err.message.replace(regexp, '').replace(/\n/g, '');
      message = message.charAt(0).toUpperCase() + message.slice(1);
      return done(message);
    }
    return done(true);
  });
}

function getDatabases(answers, callback) {
  const done = callback || this.async();
  const databases = [];

  const db = function db() {
    const query = dbClient.query("SELECT datname FROM pg_database WHERE datistemplate = false AND datname <> 'postgres' ORDER BY datname;");
    query.on('row', row => databases.push(row.datname));
    query.on('end', () => done(databases));
    query.on('error', err => error(err.message));
  };

  if (!dbClient) {
    connectDB(null, answers, db);
  } else {
    process.nextTick(db);
  }
}

function getSchemas(answers) {
  const done = this.async();
  const exclude = { information_schema: true, pg_catalog: true };

  connectDB(null, answers, (result) => {
    if (!result) { return done; }
  });

  const query = dbClient.query('SELECT schema_name AS "schemaName" FROM information_schema.schemata ORDER BY schema_name;');
  query.on('row', (row) => {
    if (exclude[row.schemaName] || row.schemaName.startsWith('pg_toast') || row.schemaName.startsWith('pg_temp')) {
      return;
    }

    schemas.push(row.schemaName);
  });
  query.on('end', () => done(schemas));
  query.on('error', err => error(err.message));
}
