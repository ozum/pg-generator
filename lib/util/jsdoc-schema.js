const inflection = require('inflection');

const types = {
  array:                         processArray,
  bigint:                        processInteger,
  bigserial:                     processInteger,
  bit:                           null,
  'bit varying':                 null,
  boolean:                       processBoolean,
  box:                           null,
  bytea:                         null,
  character:                     processString,
  'character varying':           processString,
  cidr:                          processIP,
  circle:                        null,
  date:                          processDate,
  'double precision':            processNumeric,
  hstore:                        null,
  inet:                          processIP,
  integer:                       processInteger,
  interval:                      null,
  json:                          processJSON,
  jsonb:                         processJSON,
  line:                          null,
  lseg:                          null,
  macaddr:                       null,
  money:                         processNumeric,
  numeric:                       processNumeric,
  path:                          null,
  point:                         null,
  polygon:                       null,
  real:                          processNumeric,
  smallint:                      processInteger,
  smallserial:                   processInteger,
  serial:                        processInteger,
  text:                          processText,
  'time without time zone':      processTime,
  'time with time zone':         null,
  'timestamp without time zone': processTimestamp,
  'timestamp with time zone':    null,
  tsquery:                       null,
  tsvector:                      null,
  txid_snapshot:                 null,
  uuid:                          processUUID,
  xml:                           null,
  'user-defined':                null,
};

function space(text, maxLength = 20) {
  return ' '.repeat(Math.max(0, maxLength - (text || '').length));
}

function shorten(text, maxLength = 50) {
  return (text || '').substring(0, maxLength).replace(/\n/g, ' ') + ((text || '').length > maxLength ? '...' : '');
}

// Regex Source:: https://rgxdb.com/r/2LE6429J
const timeRegex = '^(?:(?:(?:0?[1-9]|1[0-2])(?::|.)[0-5]d(?:(?::|.)[0-5]d)? ?[aApP][mM])|(?:(?:0?d|1d|2[0-3])(?::|.)[0-5]d(?:(?::|.)[0-5]d)?))$';

// const formats = {
//     macaddr: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
//     bit: '^[10]*$',
//     uuid: '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
// };

const skipKey = ['xcreated_at', 'xupdated_at'];

/**
 * Returns string representation of jsdoc schema for given table.
 * @param   {Object}    table             - pg-structure table object.
 * @param   {Object}    [options]         - Options
 * @param   {string[]}  [options.exclude] - Column names to exclude
 * @returns {string}                      - String representation of jsdoc Schema;
 */
function process(table, { exclude = [] } = {}) {
  let result = table.columns.array
    .filter(column => !exclude.includes(column.name))
    .map(column => processColumn(column))
    .filter(Boolean)
    .reduce((prev, columnSchema) => prev + columnSchema, '');

  result += table.o2mRelations.array.reduce((types, relation) => types + processRelation(relation), '');
  result += table.m2oRelations.array.reduce((types, relation) => types + processRelation(relation), '');
  result += table.m2mRelations.array.reduce((types, relation) => types + processRelation(relation), '');
  return result;
}

function processRelation(relation) {
  const constraint = relation.type === 'MANY TO MANY' ? relation.targetConstraint : relation.constraint;
  const mandatory = Array.from(constraint.columns.values()).every(col => col.notNull && col.default === null);
  const isArray = relation.type === 'MANY TO MANY' || relation.type === 'ONE TO MANY';
  const type = `${relation.targetTable.name}${isArray ? '[]' : ''}`;
  // console.log(relation.generateName(), inflection.camelize(relation.generateName(), true));
  const name = `${mandatory ? '' : '['}${inflection.camelize(relation.generateName(), true)}${mandatory ? '' : ']'}`;
  return ` * @param {${type}}${space(type)} ${name}${space(name)} - ${shorten(constraint.description)}\n`;
}

function processColumn(column) {
  if (column.isForeignKey || skipKey.indexOf(column.name) > -1 || !types[column.type]) {
    return;
  }

  let columnSchema = '';
  const method = column.isSerial ? 'processInteger' : types[column.type];

  if (column.enumValues) {
    // property.enum = column.enumValues;
  } else if (typeof method === 'function') {
    const required = column.notNull && column.default === null;
    const type = method(column);
    const name = required ? column.name : `[${column.name}]`;
    columnSchema = ` * @param {${type}}${space(type)} ${name}${space(name)} - ${shorten(column.description)}\n`;
  }

  return columnSchema;
}

function processInteger(column) {
  return 'number';
}

function processString(column) {
  return 'string';
}

function processText(column) {
  return 'string';
}

function processDate(column) {
  return 'Date';
}

function processTime(column) {
  return 'string';
}

function processTimestamp(column) {
  return 'string';
}

function processNumeric(column) {
  return 'number';
}

function processBoolean(column) {
  return 'boolean';
}

function processArray(column) {
  const type = types[column.arrayType]();
  return `${type}${'[]'.repeat(column.arrayDimension)}`;
}

function processIP(column) {
  return 'string';
}

function processJSON(column) {
  return 'string';
}

function processUUID(column) {
  return 'UUID';
}

module.exports.process = process;
