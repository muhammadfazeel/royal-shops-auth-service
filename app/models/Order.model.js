"use strict";

module.exports = (sequelize, DataTypes) => {
    var Order = sequelize.define("Order", {
        totalAmount: {
            type: DataTypes.FLOAT,
            require: false
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        },
        amountPaid: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        credit: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        OrderId: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    },
        {
            freezeTableName: true
        });
    Order.associate = function (models) {
        Order.belongsTo(models.User, {
            as: 'shop',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'ShopId',
                allowNull: true,
                field: 'ShopId'
            }
        });
        Order.belongsToMany(models.Product, {
            as: 'product',
            through: 'OrderProduct',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'OrderId',
                allowNull: true,
                field: 'OrderId'
            }
        });
        Order.hasMany(models.OrderProduct, {
            as: 'products',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'OrderId',
                allowNull: true,
                field: 'OrderId'
            }
        });
        Order.belongsTo(models.Customer, {
            as: 'customer',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'CustomerId',
                allowNull: true,
                field: 'CustomerId'
            }
        });

    };
    return Order;
};
