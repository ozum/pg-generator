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

// Regex Source:: https://rgxdb.com/r/2LE6429J
const timeRegex = '^(?:(?:(?:0?[1-9]|1[0-2])(?::|.)[0-5]d(?:(?::|.)[0-5]d)? ?[aApP][mM])|(?:(?:0?d|1d|2[0-3])(?::|.)[0-5]d(?:(?::|.)[0-5]d)?))$';

// const formats = {
//     macaddr: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
//     bit: '^[10]*$',
//     uuid: '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
// };

const skipKey = ['xcreated_at', 'xupdated_at'];

function process(table) {
  const schema = {};
  let result = '';

  for (const column of table.columns.values()) {
    const columnSchema = processColumn(column);

    if (columnSchema) {
      result += columnSchema;
    }
  }

  result += table.o2mRelations.array.reduce((types, relation) => types + processRelation(relation), '');
  result += table.m2oRelations.array.reduce((types, relation) => types + processRelation(relation), '');
  result += table.m2mRelations.array.reduce((types, relation) => types + processRelation(relation), '');
  return result;
}

function processRelation(relation) {
  const constraint = relation.type === 'MANY TO MANY' ? relation.targetConstraint : relation.constraint;
  const mandatory = Array.from(constraint.columns.values()).every(col => col.notNull);
  const isArray = relation.type === 'MANY TO MANY' || relation.type === 'ONE TO MANY';
  const type = `${relation.targetTable.name}${isArray ? '[]' : ''}`;
  const name = `${relation.generateName()}${mandatory ? '!' : '?'}`;
  return `${name}: ${type}\n`;
}

function processColumn(column) {
  if (column.isForeignKey || skipKey.indexOf(column.name) > -1 || !types[column.type]) {
    return;
  }

  if (column.isSerial) {
    return `readonly ${column.name}!: number;`;
  }

  let columnSchema = '';
  const method = types[column.type];

  if (column.enumValues) {
    // property.enum = column.enumValues;
  } else if (typeof method === 'function') {
    columnSchema = `${column.name}${column.notNull ? '!' : '?'}: ${method(column)}\n`;
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
  return 'string';
}

module.exports.process = process;
