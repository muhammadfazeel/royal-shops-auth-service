"use strict";
module.exports = (sequelize, DataTypes) => {
    var OrderProduct = sequelize.define(
        "OrderProduct",
        {
            OrderId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Order',
                    key: 'id'
                }
            },
            ProductId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Product',
                    key: 'id'
                }
            }
        },
        {
            freezeTableName: true,
        }
    );

    OrderProduct.associate = function (models) {
        OrderProduct.belongsTo(models.Order, {
            as: "order",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: {
                name: "OrderId",
                allowNull: false,
                field: "OrderId",
            },
        });
        OrderProduct.belongsTo(models.Product, {
            as: "product",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: {
                name: "ProductId",
                allowNull: false,
                field: "ProductId",
            },
        });
    };
    return OrderProduct;
};
