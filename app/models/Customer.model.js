"use strict";

module.exports = (sequelize, DataTypes) => {
    var Customer = sequelize.define("Customer", {
        name: {
            type: DataTypes.STRING(100),
            require: true
        },
        nationalId: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        credit: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    },
        {
            freezeTableName: true
        });
    Customer.associate = function (models) {
        Customer.belongsTo(models.User, {
            as: 'shop',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'ShopId',
                allowNull: true,
                field: 'ShopId'
            }
        });
        Customer.hasMany(models.Credit, {
            as: 'credits',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'CustomerId',
                allowNull: false,
                field: 'CustomerId'
            }
        });
    };
    return Customer;
};
