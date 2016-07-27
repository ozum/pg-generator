'use strict';

const nunjucks          = require('nunjucks');
const fs                = require('fs-extra');
const path              = require('path');
const pgStructure       = require('pg-structure');
const beautify          = require('js-beautify').js_beautify;
const lodash            = require('lodash');
const winston           = require('winston');
const jsonSchema        = require('./util/json-schema');
const addFilters        = require('./util/template-filter').addFilters;

// Nunjucks envrionment for file name templating. {table.name} style single curly brace {} tags.
var nunjucksFileName    = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), { tags: { variableStart: '{', variableEnd: '}' }});
addFilters(nunjucksFileName);

class PGGenerator {
    /**
     *
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
     * @param {number}              [args.indent=4]                     - Tab length of output JS files.
     * @param {string}              [args.logLevel=info]                - Log level: error, warn, info, verbose, debug, silly.
     * @returns {Promise}                                               - Returns a promise.
     */
    constructor(args) {
        args = lodash.defaultsDeep({}, args, {indent: 4});

        if (!(args.templateDir && args.targetDir && args.connection && args.connection.database)) {
            throw new Error('Template path, target path and connection details are required.');
        }

        let loggerTransport     = new (winston.transports.Console)({prettyPrint: true, colorize: true, level: args.logLevel || 'info' });

        this.logger             = new winston.Logger({transports: [loggerTransport]});
        this.templateDir        = args.templateDir;
        this.targetDir          = args.targetDir;
        this.templateOptions    = lodash.defaultsDeep({}, args.templateOptions, { generateAliases: true });
        this.connectionParams   = args.connection;
        this.schemas            = args.schemas;
        this.beautyOptions      = {indent_size: args.indent, max_preserve_newlines: 2, end_with_newline: true};
        this.nunjucksEnv        = new nunjucks.Environment(new nunjucks.FileSystemLoader(args.templateDir), { autoescape: false, throwOnUndefined: false });
        this.templateContent    = {};
        this.fileExtension      = args.fileExtension || 'nunj.html';
        this.customData         = args.customData || {};
        this.beautifier         = args.beautifier !== false;

        this.templateModule     = this.requireModule();

        addFilters(this.nunjucksEnv);
    }

    /**
     * If available requires index.js file located in template root and returns the result.
     * @returns {Object} - Required module.
     */
    requireModule() {
        try {
            if (fs.statSync(path.join(this.templateDir, 'index.js')).isFile()) {
                return require(path.join(this.templateDir, 'index.js'));
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                this.logger.verbose('No template module is available.');
            } else {
                this.logger.error(`Error in template module: ${err.message}`);
                throw err;
            }
        }
    }
}

/**
 * Returns utility methods and attributes which will be available in all templates globally.
 * @returns {Object} - Object available in template via pgen key.
 */
function getSystemUtils() {
    return {
        tableJsonSchema: jsonSchema.process
    };
}

/**
 * Creates a file based on a given template and data. It compiles given template and caches for further use.
 * @param {string}      template    - Template file to execute.
 * @param {string}      target      - Target file to generate.
 * @param {Object}      data        - Data object to pass template.
 * @returns {Promise}               - Returned promise.
 * @private
 */
PGGenerator.prototype._write = function(template, target, data) {
    return new Promise((resolve, reject) => {
        let relativeTarget = path.relative(this.targetDir, target); // Used for logging.
        data.options    = this.templateOptions;
        data.custom     = this.customData;

        this.logger.debug(`Trying to create file: ${relativeTarget}`);

        if (!this.templateContent[template]) {
            let templateBody = fs.readFileSync(template).toString();
            this.templateContent[template] = nunjucks.compile(templateBody, this.nunjucksEnv, template);
            this.logger.verbose(`Template compiled: ${path.relative(this.templateDir, template)}`);
        }

        let content     = this.templateContent[template].render(data);

        if (this.beautifier && (path.extname(target) === '.js' || path.extname(target) === '.html')) {
            content         = beautify(content, this.beautyOptions);
        }

        fs.outputFile(target, content, (err) => {
            this.logger.info(`File created: ${relativeTarget}`);
            return (err) ? reject(err) : resolve();
        });
    });
};

/**
 * Copies given file or directory to the target.
 * @param {string}      from    - Path of file or directory to be copied.
 * @param {string}      to      - Path of target where file or directory copied to.
 * @returns {Promise}           - Result Promise.
 * @private
 */
PGGenerator.prototype._copy = function copy(from, to) {
    return new Promise((resolve, reject) => {
        fs.copy(from, to, (err) => {
            if (err) { return reject(err); }
            this.logger.debug(`File copied from "${from}" to "${to}"`);
            return resolve();
        });
    });
};

/**
 * Creates all files based on details in object instance.
 * @returns {Promise}   - Returns a promise which will be fullfilled when all files are generated.
 */
PGGenerator.prototype.writeAll = function() {
    this.logger.verbose(`Started to get database details for: ${this.connectionParams.database}`);
    return pgStructure(this.connectionParams, this.schemas)
        .then((db) => {
            this.logger.verbose('Got database details.');
            return new Promise((resolve, reject) => {
                let promises    = [];
                let pgen        = this;
                let rxDir       = new RegExp('^(.+?)\\' + path.sep);        // First directory such as db/
                let rxExtension = new RegExp(`\.${this.fileExtension}$`);   // File name extension such as .nunj.html

                this.logger.info(`Starting to walk template directory: '${this.templateDir}' for target directory '${this.targetDir}'`);

                // Categorize templates based on top level directory relative to template dir.
                fs.walk(pgen.templateDir)
                    .on('readable', function() {
                        let item;
                        while ((item = this.read())) {
                            if (!item.stats.isFile()) { continue; }

                            let template        = item.path;                                                // Ex: .../template/sequelize/table/definition/account.js.nunj
                            let relative        = path.relative(pgen.templateDir, template);                // Ex: table/definition/account.js.nunj
                            let category        = relative.match(rxDir) ? relative.match(rxDir)[1] : null;  // Template root dir: db | schema | table | copy etc.
                            let relativeTarget  = relative.replace(rxDir, '').replace(rxExtension, '');     // Ex: table/definition/account.js.nunj -> definition/account.js.nunj
                            let target          = path.join(pgen.targetDir, relativeTarget);                // Ex: model/definition/account.js.nunj
                            target              = target.replace('#', '|');                                 // Nunucks uses | char for filters, but it's invalid char in windows file names. # is used for filtering, convert # to |;

                            pgen.logger.debug('Template Variables:', { template: template, relative: relative, relativeTarget: relativeTarget, target: target });

                            if (category === 'copy') {
                                promises.push(pgen._copy(template, target));
                                continue;
                            }

                            let extraData = pgen.templateModule && pgen.templateModule.allData ? pgen.templateModule.allData(db) : {};

                            if (category === 'db') {
                                let extraDBData = pgen.templateModule && pgen.templateModule.dbData ? pgen.templateModule.dbData(db) : {};
                                let data = lodash.defaultsDeep({ db: db }, { pgen: getSystemUtils() }, extraDBData, extraData);
                                let interpolatedTarget = nunjucksFileName.renderString(target, data);
                                promises.push(pgen._write(template, interpolatedTarget, data));
                            } else if (category === 'schema') {
                                for (let schema of db.schemas.values()) {
                                    let extraSchemaData = pgen.templateModule && pgen.templateModule.schemaData ? pgen.templateModule.schemaData(schema) : {};
                                    let data = lodash.defaultsDeep({ schema: schema }, { pgen: getSystemUtils() }, extraSchemaData, extraData);
                                    let interpolatedTarget = nunjucksFileName.renderString(target, data);
                                    promises.push(pgen._write(template, interpolatedTarget, data));
                                }
                            } else if (category === 'table') {
                                for (let schema of db.schemas.values()) {
                                    for (let table of schema.tables.values()) {
                                        let extraTableData = pgen.templateModule && pgen.templateModule.tableData ? pgen.templateModule.tableData(table) : {};
                                        let data = lodash.defaultsDeep({ table: table }, { pgen: getSystemUtils() }, extraTableData, extraData);
                                        let interpolatedTarget = nunjucksFileName.renderString(target, data);
                                        promises.push(pgen._write(template, interpolatedTarget, data));
                                    }
                                }
                            }
                        }
                    })
                    .on('end',   ()          => Promise.all(promises).then(() => resolve()).catch((err) => reject(err)))
                    .on('error', (err, item) => reject(new Error(`Template path ${item.path} cannot be processed.\n${err}`)));
            });
        });
};

module.exports = PGGenerator;
