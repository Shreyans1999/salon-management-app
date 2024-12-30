const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const Service = sequelize.define('Service', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  duration: {
    type: Sequelize.INTEGER, // in minutes
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = Service;