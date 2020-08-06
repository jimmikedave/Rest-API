'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    emailAddress: Sequelize.STRING,
    password: Sequelize.STRING
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
        foreignKey: {
            allowNull: false,
        },
    });
  };

  return User;
};