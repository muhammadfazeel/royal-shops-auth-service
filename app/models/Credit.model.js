"use strict";

module.exports = (sequelize, DataTypes) => {
    var Credit = sequelize.define("Credit", {
        credit: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    },
        {
            freezeTableName: true
        });
    Credit.associate = function (models) {
        Credit.belongsTo(models.Customer, {
            as: 'customer',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            foreignKey: {
                name: 'CustomerId',
                allowNull: false,
                field: 'CustomerId'
            }
        });
    };
    return Credit;
};
