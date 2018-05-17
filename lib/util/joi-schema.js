const types = {
  array: processArray,
  bigint: processInteger,
  bigserial: processInteger,
  bit: null,
  "bit varying": null,
  boolean: processBoolean,
  box: null,
  bytea: null,
  character: processString,
  "character varying": processString,
  cidr: processIP,
  circle: null,
  date: processDate,
  "double precision": processNumeric,
  hstore: null,
  inet: processIP,
  integer: processInteger,
  interval: null,
  json: processJSON,
  jsonb: processJSON,
  line: null,
  lseg: null,
  macaddr: null,
  money: processNumeric,
  numeric: processNumeric,
  path: null,
  point: null,
  polygon: null,
  real: processNumeric,
  smallint: processInteger,
  smallserial: processInteger,
  serial: processInteger,
  text: processText,
  "time without time zone": processTime,
  "time with time zone": null,
  "timestamp without time zone": processTimestamp,
  "timestamp with time zone": null,
  tsquery: null,
  tsvector: null,
  txid_snapshot: null,
  uuid: null,
  xml: null,
  "user-defined": null
};

// Regex Source:: https://rgxdb.com/r/2LE6429J
const timeRegex =
  "^(?:(?:(?:0?[1-9]|1[0-2])(?::|.)[0-5]d(?:(?::|.)[0-5]d)? ?[aApP][mM])|(?:(?:0?d|1d|2[0-3])(?::|.)[0-5]d(?:(?::|.)[0-5]d)?))$";

// const formats = {
//     macaddr: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
//     bit: '^[10]*$',
//     uuid: '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
// };

const skipKey = ["xcreated_at", "xupdated_at"];

function process(table) {
  const schema = {};

  for (const column of table.columns.values()) {
    schema[column.name] = processColumn(column);
  }

  return schema;
}

function processColumn(column) {
  if (column.isSerial || skipKey.indexOf(column.name) > -1 || !types[column.type]) {
    return processInteger(column);
  }

  let columnSchema = "";

  if (column.enumValues) {
    // property.enum = column.enumValues;
  } else if (typeof method === "function") {
    const method = types[column.type];
    columnSchema = method(column);
  }

  if (column.notNull) {
    columnSchema += ".required()";
  }

  return columnSchema;
}

function processInteger(column) {
  const limit = Math.pow(2, column.precision) / 2;
  return `Joi.number().integer().min(${column.isSerial ? 1 : -limit}).max(${limit - 1})`;
}

function processString(column) {
  return `Joi.string().max(${column.length})`;
}

function processText(column) {
  const property = "Joi.string()";

  if (column.length) {
    property += `.max(${column.length})`;
  }
  return property;
}

function processDate(column) {
  return "Joi.date()";
}

function processTime(column) {
  return `Joi.string().regex(/${timeRegex}/, "time")`;
}

function processTimestamp(column) {
  return "Joi.string().isoDate()";
}

function processNumeric(column) {
  const limit = Math.pow(10, column.precision - column.scale) - 1;
  return `Joi.number().min(${-limit}).max(${limit})`;
}

function processBoolean(column) {
  return `Joi.boolean()`;
}

function processArray(column) {
  const property = schema[column.name];
  let inner = property;
  property.type = "array";
  property.items = {};

  for (let i = 2; i <= column.arrayDimension; i++) {
    inner = inner.items;
    inner.items = {};
    inner.type = "array";
  }

  inner.items.type = column.arrayType;
}

function processIP(column) {
  return `Joi.string().ip()`;
}

function processJSON(column) {
  // TODO: Consider custom JOI class
  return `Joi.string()`;
}

module.exports.process = process;
