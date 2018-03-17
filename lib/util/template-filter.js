'use strict';

var inflection  = require('inflection');
var util        = require('util');

/**
 * Clears SQL type escapes (Two quote '' to one quote ') and strips beginning and trailing quotes around string.
 * Also escapes result according to JSON standards.
 * @param   {string}                    string  - Default value returned from PostgreSQL.
 * @returns {string|boolean|undefined}          - Default value to use in template.
 * @example
 * var clear = clearDefaultValue("'No ''value'' given'");
 * console.log(clear);    // "No value 'given'"
 */
function clearDefault(string) {
    // Does not support SQL functions. IMHO it is better to handle sql function default values in RDMS.
    if (string === null || string === undefined || string === '') { return; }
    let defaultValue;
    let lowercaseString;
    let booleanValue;

    if (string.charAt(0) === "'" || string.charAt(0) === '"') {
        string = string.substring(1, string.length - 1);
        defaultValue = string.replace(/''/g, "'");
    } else if (! Number.isNaN(+string)) {
        return string;
    } else {
        lowercaseString = string.toLowerCase();
        booleanValue = (lowercaseString === 'true');
        if (booleanValue || lowercaseString === 'false') {
            defaultValue = booleanValue;
        }
    }

    return JSON.stringify(defaultValue);
}

/**
 * Converts foreign key name to be used in a relationship. If string ends with '_id' or 'id', strips it (case insensitive).
 * Otherwise adds given prefix at the beginning of the string. company_id -> company, account -> related_account
 * @param   {string}    str              - Foreign key name.
 * @param   {string}    [prefix=related] - Prefix to add if no given string does not contain 'id'.
 * @returns {string}                     - Name for the belongsTo relationship.
 */
function relationName(str, prefix) {
    prefix = prefix === undefined ? 'related' : prefix;
    // Transform ? company_id -> company : company -> related_company
    return (str.match(/_?id$/i)) ? str.replace(/_?id$/i, '') : `${prefix}_${str}`;
}

/**
 * Variadic function which strips given list of strings or object's names from start of the source string.
 * @param   {string}            source      - Source string to be cleaned.
 * @param   {...string|Object}  arguments   - List of strings or objects (object's names) to delete from source string.
 * @returns {string}                        - Cleaned string.
 */
function stripPrefix(source) {
    return _strip('pre', source, Array.prototype.slice.call(arguments, 1));
}

/**
 * Variadic function which strips given list of strings or object's names from end of the source string.
 * @param   {string}            source      - Source string to be cleaned.
 * @param   {...string|Object}  arguments   - List of strings or objects (object's names) to delete from source string.
 * @returns {string}                        - Cleaned string.
 */
function stripSuffix(source) {
    return _strip('post', source, Array.prototype.slice.call(arguments, 1));
}

/**
 * Variadic function which strips given list of strings or object's names from source string.
 * @private
 * @param   {string}            source      - Source string to be cleaned.
 * @param   {...string|Object}  arguments   - List of strings or objects (object's names) to delete from source string.
 * @returns {string}                        - Cleaned string.
 */
function strip(source) {
    return _strip('', source, Array.prototype.slice.call(arguments, 1));
}

/**
 * Strips given array of strings or object's names from start, middle or end of source string.
 * @private
 * @param   {string|null}               position    - pre|post|undefined. Pre strips from start, post from end and undefined from middle.
 * @param   {string}                    source      - Source string to strip from.
 * @param   {Array.<Object|string>}     strip       - List of strings and objects (to strip object.name) to strip.
 * @returns {string}                                - Cleaned string
 */
function _strip(position, source, strip) {
    position = position.toLowerCase();
    for (let object of strip) {
        let name = object.name || object;
        let rx   = new RegExp(name + '[_\\s-]*');
        if (position === 'pre') { rx = new RegExp('^' + name + '[_\\s-]*'); }
        if (position === 'post') { rx = new RegExp('[_\\s-]*' + name + '$'); }
        source = source.replace(rx, '');
    }

    return source;
}

/**
 * Pads given string's right side with given character (default space) to complete its length to count.
 * @param   {string}    str             - Source string.
 * @param   {number}    count           - Total length of the result string.
 * @param   {string}    [char=space]    - Padding character
 * @returns {string}                    - Result string with length of count.
 */
function padRight(str, count, char) {
    char = char || ' ';
    if (!str || !char || str.length >= count) {
        return str;
    }
    var max = (count - str.length) / char.length;
    for (var i = 0; i < max; i++) {
        str += char;
    }

    return str;
}

/**
 * Wraps given string with single quotes and escapes single quotes in it.
 * @param   {string} str    - Source string.
 * @returns {string}        - Result string wrapped by single quotes.
 */
function singleQuote(str) {
    return "'" + str.replace(/'/g, "\\'") + "'";
}

/**
 * Converts given object's null values to undefined recursively.
 * @param   {Object|string} data    - Source string or object.
 * @returns {Object|string}         - Result
 */
function convertNullToUndef(data) {
  if (typeof data !== 'object') {
    return data;
  }

  if (data === null) {
    return undefined;
  }

  for (const key of Object.keys(data)) {
    if (typeof data[key] === 'object') {
      data[key] = convertNullToUndef(data[key]);
    }
  }
  return data;
}

/**
 * If given data is object converts it to string by:
 * 1. If it has `toString` method uses it. If it returns [object Object] tries other steps.
 * 2. Uses require('util').inspect();
 * @param   {Object|string} data                  - Source string or object.
 * @param   {Object}        options               - Options
 * @param   {boolean}       options.nullToUndef   - If true, converts all null values to undefined.
 * @returns {string}                              - Result string.
 */
function stringifyIfObject(data, options) {
  if(options && options.nullToUndef) {
    data = convertNullToUndef(data);
  }

  if (typeof data !== 'object') {
    return data;
  }

  let result;

  if (typeof data.toString === 'function') {
    result = data.toString();
  }

  if (result === undefined || result === '[object Object]') {
    result = util.inspect(data, {depth: null});
  }

  return result;
}

/**
 * If given data is a multi line string replcaes new lines with escape characters. May be used to prevent JS multi line errors.
 * @param   {string} str    - Source string.
 * @returns {string}        - Result string with escape characters.
 */
function singleLine(str) {
    str = str.replace(/\r\n/g, '\\r\\n');
    str = str.replace(/\n/g, '\\n');
    return str;
}

/**
 * @name nunjucks.env#addFilter
 * @private
 * @description Adds filter to nunjucks environmet.
 */

/**
 * Adds filters to given Nunjucks environment.
 * @private
 * @param {nunjucks.env} env    - Nujucks environment.
 * @returns {void}              - Returns undefined.
 */
function addFilters(env) {
    env.addFilter('camelCase', (str) => inflection.camelize(str, true));    // Ex: user_name -> userName
    env.addFilter('pascalCase', (str) => inflection.camelize(str, false));  // Ex: user_name -> UserName
    env.addFilter('classCase', (str) => inflection.classify(str));          // Ex: user_names -> UserName
    env.addFilter('snakeCase', (str) => inflection.underscore(str));        // Ex: userName  -> user_name
    env.addFilter('dashCase', (str) => inflection.transform(str, ['underscore', 'dasherize'])); // Ex: User Name -> user-name
    env.addFilter('singular', (str) => inflection.singularize(str));        // Ex: user_names -> user_name
    env.addFilter('plural', (str) => inflection.pluralize(str));            // Ex: user_name -> user_names
    env.addFilter('clearDefault', clearDefault);                            // 'O''Reilly' -> "O'Reilly, 'x"x@x.com' -> "x\"x@c.com"
    env.addFilter('quote', (str) => JSON.stringify(str));
    env.addFilter('singleQuote', (str) => singleQuote(str));

    env.addFilter('stripPrefix', stripPrefix);
    env.addFilter('stripSuffix', stripSuffix);
    env.addFilter('strip', strip);

    env.addFilter('padRight', padRight);

    env.addFilter('relationName', relationName);
    env.addFilter('stringifyIfObject', stringifyIfObject);
    env.addFilter('singleLine', singleLine);
}

module.exports.addFilters = addFilters;
