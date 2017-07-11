const nunjucks          = require('nunjucks');
const klaw              = require('klaw');
const path              = require('path');
const pgStructure       = require('pg-structure');
const fs                = require('fs-promise');
const beautify          = require('js-beautify').js_beautify;
const lodash            = require('lodash');
const winston           = require('winston');
const jsonSchema        = require('./util/json-schema');
const addFilters        = require('./util/template-filter').addFilters;
const fix               = require('eslint-fixer');

// Nunjucks envrionment for file name templating. {table.name} style single curly brace {} tags.
const nunjucksFileName    = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), { tags: { variableStart: '{', variableEnd: '}' } });
addFilters(nunjucksFileName);

/**
 * Returns utility methods and attributes which will be available in all templates globally.
 * @returns {Object} - Object available in template via pgen key.
 */
function getSystemUtils() {
  return {
    tableJsonSchema: jsonSchema.process,
  };
}

/**
 * Creates a file based on a given template and data. It compiles given template and caches for further use.
 * @param {PGGenerator} pgenInstance  - PGGenerator object.
 * @param {string}      template      - Template file to execute.
 * @param {string}      target        - Target file to generate.
 * @param {Object}      templateData  - Data object to pass template.
 * @returns {Promise}                 - Returned promise.
 * @private
 */
function write(pgenInstance, template, target, templateData) {
  const pgen           = pgenInstance;
  const data           = templateData;
  const relativeTarget = path.relative(pgen.targetDir, target); // Used for logging.
  data.options         = pgen.templateOptions;
  data.custom          = pgen.customData;

  pgen.logger.debug(`Trying to create file: ${relativeTarget}`);

  if (!pgen.templateContent[template]) {
    const templateBody = fs.readFileSync(template).toString();
    pgen.templateContent[template] = nunjucks.compile(templateBody, pgen.nunjucksEnv, template);
    pgen.logger.verbose(`Template compiled: ${path.relative(pgen.templateDir, template)}`);
  }

  let content     = pgen.templateContent[template].render(data);

  if (pgen.beautifier && (path.extname(target) === '.js' || path.extname(target) === '.html')) {
    content         = beautify(content, pgen.beautyOptions);
  }

  return fs.outputFile(target, content)
    .then(() => {
      pgen.logger.info(`File created: ${relativeTarget}`);
    });
}

/**
 * Returns data object to use in template.
 * @param   {PGGenerator}       pgen      - PGGenerator object.
 * @param   {pgStructure#db}    db        - PGStructure db instance.
 * @param   {pgStructure.<any>} dbItem    - PGStructure instance of db, schema or table.
 * @param   {string}            category  - Item category of db, schema or table.
 * @returns {Object}                      - Data object to use in template.
 */
function getConsolidatedData(pgen, db, dbItem, category) {
  const dataKey   = `${category}Data`;  // daData, schemaData or tableData;
  const extraData = pgen.templateModule && pgen.templateModule.allData ? pgen.templateModule.allData(db) : {};
  const itemData  = pgen.templateModule && pgen.templateModule[dataKey] ? pgen.templateModule[dataKey](dbItem) : {};
  return Object.assign({ [category]: dbItem, pgen: getSystemUtils() }, itemData, extraData);
}

/**
 * Executes given callback function for all database objects of given category. Callback is passed PGStructure
 * database object instance.
 * @param   {pgStructure#db}                db        - PGStructure db instance.
 * @param   {string}                        category  - Item category of db, schema or table.
 * @param   {Function.<pgStructure.<any>>}  callback  - Callback function to execute for each database item of given category.
 * @returns {void}
 */
function forEachDbObject(db, category, callback) {
  if (category === 'table') {
    db.schemas.forEach(schema => schema.tables.forEach(table => callback(table)));
  } else if (category === 'schema') {
    db.schemas.forEach(schema => callback(schema));
  } else if (category === 'db') {
    callback(db);
  }
}

/**
 * Processes template file for all database objects related to that template file.
 * @private
 * @param   {PGGenerator}     pgen          - PGGenerator object.
 * @param   {string}          templateFile  - Template file to process.
 * @param   {pgStructure#db}  db            - PGStructure db instance.
 * @returns {Array.<Promise>}               - Array of promises for asynchronous processing.
 */
function processForTemplateFile(pgen, templateFile, db) {
  if (!templateFile.stats.isFile()) {
    return [];
  }

  const promises        = [];
  const rxDir           = new RegExp(`^(.+?)\\${path.sep}`);                        // First directory such as db/
  const rxExtension     = new RegExp(`\\.${pgen.fileExtension}$`);                  // File name extension such as .nunj.html

  const template        = templateFile.path;                                        // Ex: .../template/sequelize/table/definition/account.js.nunj
  const relative        = path.relative(pgen.templateDir, template);                // Ex: table/definition/account.js.nunj
  const category        = relative.match(rxDir) ? relative.match(rxDir)[1] : null;  // Template root dir: db | schema | table | copy etc.
  const relativeTarget  = relative.replace(rxDir, '').replace(rxExtension, '');     // Ex: table/definition/account.js.nunj -> definition/account.js.nunj
  let target            = path.join(pgen.targetDir, relativeTarget);                // Ex: model/definition/account.js.nunj
  target                = target.replace('#', '|');                                 // Nunucks uses | char for filters, but it's invalid char in windows file names. # is used for filtering, convert # to |;

  pgen.logger.debug('Template Variables:', { template, relative, relativeTarget, target });

  if (category === 'copy') {
    promises.push(fs.copy(template, target));
  } else {
    forEachDbObject(db, category, (dbObject) => {
      const data = getConsolidatedData(pgen, db, dbObject, category);
      const interpolatedTarget = nunjucksFileName.renderString(target, data);
      promises.push(write(pgen, template, interpolatedTarget, data));
    });
  }

  return promises;
}

/**
 * Class for generating documents based on database structure.
 */
class PGGenerator {
  /**
   * Creates instance to generate documents based on database structure.
   * @param {Object}              args                                - Constructor arguments
   * @param {string}              args.templateDir                    - Directory where to locate template files.
   * @param {string}              args.targetDir                      - Directory where output files are written.
   * @param {Object}              args.connection                     - node-postgres client or connection parameters. Parameters passed directly to node-postgres. See it for details.
   * @param {string}              args.connection.database            - Database name
   * @param {string}              [args.connection.host=localhost]    - Hostname of the database.
   * @param {number}              [args.connection.port=5432]         - Port of the database.
   * @param {string}              [args.connection.user]              - Username for connecting to db.
   * @param {string}              [args.connection.password]          - Password to connecting to db.
   * @param {boolean|Object}      [args.connection.ssl=false]         - Pass the same options as tls.connect().
   * @param {Array.<string>}      [args.schemas=[public]]             - PostgreSQL schemas to be parsed.
   * @param {String}              [args.fileExtension=nunj.html]      - Filename extension of template files.
   * @param {Object}              [args.customData]                   - Custom data to pass to template. Can be accessed under variable named 'custom' in template.
   * @param {Object}              [args.templateOptions]              - Options to pass to template. Can be accessed under variable named 'options' in template.
   * @param {boolean}             [args.beautifier=true]              - Beautify generated code.
   * @param {boolean}             [args.lintFix=false]                - Use linter --fix command.
   * @param {number}              [args.indent=4]                     - Tab length of output JS files.
   * @param {string}              [args.logLevel=info]                - Log level: error, warn, info, verbose, debug, silly.
   * @returns {Promise}                                               - Returns a promise.
   */
  constructor(args) {
    const config = lodash.defaultsDeep({}, args, { indent: 4 });

    if (!(config.templateDir && config.targetDir && config.connection && config.connection.database)) {
      throw new Error('Template path, target path and connection details are required.');
    }

    const loggerTransport     = new (winston.transports.Console)({ prettyPrint: true, colorize: true, level: config.logLevel || 'info' });

    this.logger             = new winston.Logger({ transports: [loggerTransport] });
    this.templateDir        = config.templateDir;
    this.targetDir          = config.targetDir;
    this.templateOptions    = lodash.defaultsDeep({}, config.templateOptions, { generateAliases: true });
    this.connectionParams   = config.connection;
    this.schemas            = config.schemas;
    this.beautyOptions      = { indent_size: config.indent, max_preserve_newlines: 2, end_with_newline: true };
    this.nunjucksEnv        = new nunjucks.Environment(new nunjucks.FileSystemLoader(config.templateDir), { autoescape: false, throwOnUndefined: false });
    this.templateContent    = {};
    this.fileExtension      = config.fileExtension || 'nunj.html';
    this.customData         = config.customData || {};
    this.beautifier         = config.beautifier !== false;
    this.lintFix            = config.lintFix || false;

    this.templateModule     = this.requireModule();

    addFilters(this.nunjucksEnv);

    fs.access(this.templateDir + '/util/template-filter.js', fs.F_OK, err => {
      if (!err) {
        const templateAddFiltersModule = require(this.templateDir + '/util/template-filter');
        if (templateAddFiltersModule && typeof templateAddFiltersModule.addFilters == 'function') {
          templateAddFiltersModule.addFilters(this.nunjucksEnv);
        }
      }
    });
  }

  /**
   * If available requires index.js file located in template root and returns the result.
   * @returns {Object} - Required module.
   * @throws           - Throws error if template module cannot be found.
   */
  requireModule() {
    /* eslint global-require: "off", import/no-dynamic-require: "off" */
    try {
      return require(path.join(this.templateDir, 'index.js'));
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.logger.verbose('No template module is available.');
      } else {
        this.logger.error(`Error in template module: ${err.message}`);
      }
      throw err;
    }
  }

  /**
   * Creates all files based on details in object instance.
   * @returns {Promise}   - Returns a promise which will be fullfilled when all files are generated.
   */
  writeAll() {
    this.logger.verbose(`Started to get database details for: ${this.connectionParams.database}`);
    return pgStructure(this.connectionParams, this.schemas)
      .then((db) => {
        this.logger.verbose('Got database details.');

        return new Promise((resolve, reject) => {
          let promises = [fs.outputFile(path.join(this.targetDir, '.pgen'), '')];
          const pgen = this;

          this.logger.info(`Starting to walk template directory: '${this.templateDir}' for target directory '${this.targetDir}'`);

          // Categorize templates based on top level directory relative to template dir.

          klaw(pgen.templateDir)
            .on('readable', function readableStream() {
              let templateFile;

              while ((templateFile = this.read())) {
                promises = promises.concat(processForTemplateFile(pgen, templateFile, db));
              }
            })
            .on('end',   ()          => Promise.all(promises)
              .then(() => fix(this.targetDir, { checkAvailable: true, useEslint: pgen.lintFix }))
              .then(() => resolve()).catch(err => reject(err)))
            .on('error', (err, item) => reject(new Error(`Template path ${item.path} cannot be processed.\n${err}`)));
        });
      });
  }
}


module.exports = PGGenerator;
