'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Company', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Kayıt no.'
        },
        ownerId: {
            type: DataTypes.INTEGER,
            field: 'owner_id',
            allowNull: true,
            comment: 'Owner of the company.',
            references: {
                model: 'contact',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: false,
            comment: 'Creation time.'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            allowNull: false,
            comment: 'Update time.'
        },
        name: {
            type: DataTypes.STRING(20),
            field: 'name',
            allowNull: false,
            comment: 'Name of the company.'
        },
        income: {
            type: DataTypes.INTEGER,
            field: 'income',
            allowNull: true,
            comment: 'Yearly income.'
        }
    }, {
        schema: 'public',
        tableName: 'company',
        timestamps: false,
        comment: 'Firma.'
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.
    var model = require('../index');
    var Company = model.Company;
    var Contact = model.Contact;

    Company.hasOne(Contact, {
        as: 'Contact',
        foreignKey: 'company_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });

    Company.belongsTo(Contact, {
        as: 'Owner',
        foreignKey: 'owner_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });

};
