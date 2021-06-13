"use strict";
let crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING(100),
      require: true
    },
    email: {
      type: DataTypes.STRING(100),
      isEmail: true,
      unique: true
    },
    hashedPassword: DataTypes.STRING,
    salt: DataTypes.STRING,
    passwordResetToken: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    emailVerifiedToken: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    address: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    nationalId: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  },
    {
      freezeTableName: true
    });
  User.associate = function (models) {
    User.hasMany(models.Category, {
      as: 'categories',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: {
        name: 'ShopId',
        allowNull: true,
        field: 'ShopId'
      }
    });
    User.hasMany(models.Product, {
      as: 'products',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: {
        name: 'ShopId',
        allowNull: true,
        field: 'ShopId'
      }
    });
    User.hasMany(models.Customer, {
      as: 'customers',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: {
        name: 'ShopId',
        allowNull: true,
        field: 'ShopId'
      }
    });
  };
  User.prototype.toJSON = function () {
    var values = this.get()
    delete values.hashedPassword
    delete values.salt
    delete values.otp
    delete values.otpValidTill
    delete values.balance
    return values
  }

  User.prototype.makeSalt = function () {
    return crypto.randomBytes(16).toString('base64')
  }

  User.prototype.authenticate = function (plainText) {
    return (
      this.encryptPassword(plainText, this.salt).toString() ===
      this.hashedPassword.toString()
    )
  }

  User.prototype.encryptPassword = function (password, salt) {
    if (!password || !salt) {
      return ''
    }
    salt = new Buffer.from(salt, 'base64')
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('base64')
  }
  return User;
};
