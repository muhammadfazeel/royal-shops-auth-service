"use strict";

module.exports = (sequelize, DataTypes) => {
    var Category = sequelize.define("Category", {
        name: {
            type: DataTypes.STRING(100),
            require: true
        }
    },
        {
            freezeTableName: true
        });
    Category.associate = function (models) {
        Category.belongsTo(models.User, {
            as: 'shop',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'ShopId',
                allowNull: true,
                field: 'ShopId'
            }
        });
        Category.hasMany(models.Product, {
            as: 'products',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'CategoryId',
                allowNull: true,
                field: 'CategoryId'
            }
        });
    };
    return Category;
};
