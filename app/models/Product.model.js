"use strict";

module.exports = (sequelize, DataTypes) => {
    var Product = sequelize.define("Product", {
        name: {
            type: DataTypes.STRING(100),
            require: true
        },
        retailPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            min: 0
        },
        salePrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            min: 0
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            min: 0
        }
    },
        {
            freezeTableName: true
        });
    Product.associate = function (models) {
        Product.belongsTo(models.Category, {
            as: 'category',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'CategoryId',
                allowNull: true,
                field: 'CategoryId'
            }
        });
        Product.belongsTo(models.User, {
            as: 'shop',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'ShopId',
                allowNull: true,
                field: 'ShopId'
            }
        });
        Product.belongsToMany(models.Order, {
            as: 'order',
            through: 'OrderProduct',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'ProductId',
                allowNull: true,
                field: 'ProductId'
            }
        });
        Product.hasMany(models.OrderProduct, {
            as: 'orders',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'ProductId',
                allowNull: true,
                field: 'ProductId'
            }
        });
    };
    return Product;
};
