/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('Company', {
  id: {
    type:          DataTypes.INTEGER,
    field:         'id',
    allowNull:     false,
    primaryKey:    true,
    autoIncrement: true,
    comment:       'Kayıt no.',
  },
  ownerId: {
    type:       DataTypes.INTEGER,
    field:      'owner_id',
    allowNull:  true,
    comment:    'Owner of the company.',
    references: {
      model: 'contact',
      key:   'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  createdAt: {
    type:      DataTypes.DATE,
    field:     'created_at',
    allowNull: false,
    comment:   'Creation time.',
  },
  updatedAt: {
    type:      DataTypes.DATE,
    field:     'updated_at',
    allowNull: false,
    comment:   'Update time.',
  },
  name: {
    type:         DataTypes.STRING(20),
    field:        'name',
    allowNull:    false,
    defaultValue: '',
    comment:      'Name of the company.',
  },
  income: {
    type:      DataTypes.INTEGER,
    field:     'income',
    allowNull: true,
    comment:   'Yearly income.\nMulti Line.',
  },
  codeString: {
    type:         DataTypes.STRING(20),
    field:        'code_string',
    allowNull:    true,
    defaultValue: '0',
  },
  codeInteger: {
    type:         DataTypes.INTEGER,
    field:        'code_integer',
    allowNull:    true,
    defaultValue: 0,
  },
}, {
  schema:     'public',
  tableName:  'company',
  timestamps: false,
  comment:    'Firma.',
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const Company = model.Company;
  const Contact = model.Contact;

  Company.hasOne(Contact, {
    as:         'Contact',
    foreignKey: 'company_id',
    onDelete:   'RESTRICT',
    onUpdate:   'CASCADE',
  });

  Company.belongsTo(Contact, {
    as:         'Owner',
    foreignKey: 'owner_id',
    onDelete:   'RESTRICT',
    onUpdate:   'CASCADE',
  });
};
