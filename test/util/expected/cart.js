/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => sequelize.define('Cart', {
  id: {
    type:          DataTypes.INTEGER,
    field:         'id',
    allowNull:     false,
    primaryKey:    true,
    autoIncrement: true,
    comment:       'Kayıt no.',
  },
  contactId: {
    type:       DataTypes.INTEGER,
    field:      'contact_id',
    allowNull:  false,
    comment:    'Owner of the cart.',
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
  customNameFromCustomData: {
    type:      DataTypes.STRING(20),
    field:     'name',
    allowNull: true,
    comment:   'Name of the cart.',
  },
  vat: {
    type:      DataTypes.STRING(20),
    field:     'VAT',
    allowNull: true,
  },
}, {
  schema:           'public',
  tableName:        'cart',
  timestamps:       false,
  comment:          'Alışveriş sepeti.',
  customDataString: 'String',
  customDataObject: {
    a: 1,
    b: "O'Reilly",
  },
});

module.exports.initRelations = () => {
  delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

  const model = require('../index');
  const Cart = model.Cart;
  const CartLineItem = model.CartLineItem;
  const Contact = model.Contact;
  const Product = model.Product;

  Cart.hasMany(CartLineItem, {
    as:         'CartLineItems',
    foreignKey: 'cart',
    onDelete:   'RESTRICT',
    onUpdate:   'CASCADE',
  });

  Cart.belongsTo(Contact, {
    as:         'Contact',
    foreignKey: 'contact_id',
    onDelete:   'RESTRICT',
    onUpdate:   'CASCADE',
  });

  Cart.belongsToMany(Product, {
    as:         'CartLineItemProducts',
    through:    CartLineItem,
    foreignKey: 'cart',
    otherKey:   'product_id',
    onDelete:   'RESTRICT',
    onUpdate:   'CASCADE',
  });
};
