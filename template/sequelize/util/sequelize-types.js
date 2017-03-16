// PostgreSQL Enum type comes as user-defined. As a result it should be handled manually.
const sequelizeTypes = {
    array                           : { type: '.ARRAY' },
    bigint                          : { type: '.BIGINT', hasLength: true },
    bigserial                       : { type: '.BIGINT', hasLength: true },
    bit                             : { type: '.CHAR', hasLength: true },       // Not directly supported in Sequelize
    'bit varying'                   : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    boolean                         : { type: '.BOOLEAN' },
    box                             : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    bytea                           : { type: '.BLOB' },
    character                       : { type: '.CHAR', hasLength: true },
    'character varying'             : { type: '.STRING', hasLength: true },
    cidr                            : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    circle                          : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    date                            : { type: '.DATEONLY' },
    'double precision'              : { type: '.FLOAT', hasPrecision: true },
    hstore                          : { type: '.HSTORE' },
    inet                            : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    integer                         : { type: '.INTEGER', hasLength: true },
    interval                        : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    json                            : { type: '.JSON' },
    jsonb                           : { type: '.JSONB' },
    line                            : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    lseg                            : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    macaddr                         : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    money                           : { type: '.DECIMAL', hasPrecision: true },
    numeric                         : { type: '.DECIMAL', hasPrecision: true },
    path                            : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    point                           : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    polygon                         : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    real                            : { type: '.FLOAT', hasPrecision: true },
    smallint                        : { type: '.INTEGER', hasLength: true },
    smallserial                     : { type: '.INTEGER', hasLength: true },
    serial                          : { type: '.INTEGER', hasLength: true },
    text                            : { type: '.TEXT' },
    'time without time zone'        : { type: '.TIME' },
    'time with time zone'           : { type: '.TIME' },
    'timestamp without time zone'   : { type: '.DATE' },
    'timestamp with time zone'      : { type: '.DATE' },
    tsquery                         : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    tsvector                        : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    txid_snapshot                   : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    uuid                            : { type: '.UUID' },
    xml                             : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    'user-defined'                  : { type: '.STRING', hasLength: true },     // Not directly supported in Sequelize
    int4range                       : { type: ".RANGE('INTEGER')" },
    int8range                       : { type: ".RANGE('BIGINT')" },
    numrange                        : { type: ".RANGE('DECIMAL')" },
    tsrange                         : { type: ".RANGE('DATENOTZ')" },
    tstzrange                       : { type: ".RANGE('DATE')" },
    daterange                       : { type: ".RANGE('DATEONLY')" }
};

/**
 * Returns Sequelize ORM data type for given column.
 * @param {pgStructure.column}  column      - {@link http://www.pg-structure.com/api/Column/ pg-structure column object}.
 * @returns {string}                        - Sequelize data type.
 * @example
 * {{ util.sequelizeType() }}        // DataTypes.INTEGER(3)
 * {{ sequelizeType('Sequelize') }}  // Sequelize.INTEGER(3)
 */
function sequelizeType(column) {
    if (!sequelizeTypes[column.type]) throw new Error(`'${column.fullName}' column is data type of '${column.type}', which is not defined in sequelize types in ${__filename}`);
    const varName = 'DataTypes';
    let enumValues = column.enumValues;
    let type = enumValues ? '.ENUM' : sequelizeTypes[column.type].type;
    const realType = column.arrayDimension >= 1 ? column.arrayType : column.type; // Type or type of array (if array).
    const hasLength = sequelizeTypes[realType].hasLength;
    const hasPrecision = sequelizeTypes[realType].hasPrecision;
    const isObject = type && type.indexOf('.') !== -1;             // . ile başlıyorsa değişkene çevirmek için
    let details;
    let isArrayTypeObject;

    if (isObject) { type = varName + type; }

    details = function(num1, num2) {
        let detail = '';
        if (num1 >= 0 && num1 !== null && num2 && num2 !== null) {
            detail = '(' + num1 + ',' + num2 + ')';         // (5,2)
        } else if (num1 >= 0 && num1 !== null) {
            detail = '(' + num1 + ')';                      // (5)
        }

        return detail;
    };

    if (column.arrayDimension >= 1) {
        isArrayTypeObject = sequelizeTypes[column.arrayType].type.indexOf('.') !== -1;
        type += '(';
        if (column.arrayDimension > 1) { type += new Array(column.arrayDimension).join(varName + '.ARRAY('); } // ArrayDimension -1 tane 'ARRAY(' yaz.

        type += isArrayTypeObject ? varName : "'";
        type += sequelizeTypes[column.arrayType].type;
        type += isArrayTypeObject ? '' : "'";
    }

    if (enumValues) {
        enumValues = JSON.stringify(enumValues);
        enumValues = enumValues.substring(1, enumValues.length - 1); // Strip '[ ' and ' ]'
        type += '(' + enumValues + ')';
    }

    if (hasPrecision) {
        type += details(column.precision, column.scale);
    }

    if (hasLength) {
        type += details(column.length);
    }

    if (column.arrayDimension >= 1) {
        type += new Array(column.arrayDimension + 1).join(')'); // ArrayDimension -1 tane parantez kapa ')' yaz.
    }

    if (!isObject) {
        type = "'" + type + "'";
    }

    return type;
}

module.exports = sequelizeType;
