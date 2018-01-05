

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
  uuid:                          null,
  xml:                           null,
  'user-defined':                null,
};

// const formats = {
//     macaddr: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
//     bit: '^[10]*$',
//     uuid: '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
// };

const skipKey = ['xcreated_at', 'xupdated_at'];

function process(table) {
  const schema = {
    title:                table.name,
    description:          table.comment,
    type:                 'object',
    additionalProperties: false,
    properties:           {},
    required:             [],
  };

  for (const column of table.columns.values()) {
    processColumn(schema, column);
  }

  return schema;
}

function processColumn(schema, column) {
  if (column.isSerial || skipKey.indexOf(column.name) > -1 || !types[column.type]) {
    return;
  }

  const method = types[column.type];
  const property = (schema.properties[column.name] = {});

  if (column.enumValues) {
    property.enum = column.enumValues;
  } else if (typeof method === 'function') {
    method(schema, column);
  }

  if (column.notNull) {
    schema.required.push(column.name);
  }
}

function processInteger(schema, column) {
  const limit = Math.pow(2, column.precision) / 2;
  const property = schema.properties[column.name];
  property.type = 'integer';
  property.minimum = column.isSerial ? 1 : -limit;
  property.maximum = limit - 1;
}

function processString(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'string';
  property.maxLength = column.length;
}

function processText(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'string';
  if (column.length) {
    property.maxLength = column.length;
  }
}

function processDate(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'string';
  property.format = 'date';
}

function processTime(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'string';
  property.format = 'time';
}

function processTimestamp(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'string';
  property.format = 'date-time';
}

function processNumeric(schema, column) {
  const limit = Math.pow(10, column.precision - column.scale) - 1;
  const property = schema.properties[column.name];
  property.type = 'number';
  property.minimum = -limit;
  property.maximum = limit;
}

function processBoolean(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'boolean';
}

function processArray(schema, column) {
  const property = schema.properties[column.name];
  let inner = property;
  property.type = 'array';
  property.items = {};

  for (let i = 2; i <= column.arrayDimension; i++) {
    inner = inner.items;
    inner.items = {};
    inner.type = 'array';
  }

  inner.items.type = column.arrayType;
}

function processIP(schema, column) {
  const property = schema.properties[column.name];
  property.anyOf = [{ type: 'string', format: 'ipv4' }, { type: 'string', format: 'ipv6' }];
}

function processJSON(schema, column) {
  const property = schema.properties[column.name];
  property.type = 'object';
}

module.exports.process = process;
