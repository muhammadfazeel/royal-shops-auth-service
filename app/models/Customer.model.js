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
    };
    return Customer;
};
