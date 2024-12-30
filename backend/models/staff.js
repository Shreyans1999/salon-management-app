const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const Staff = sequelize.define('Staff', {
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
  specialization: {
    type: Sequelize.STRING
  },
  workingHours: {
    type: Sequelize.JSON // Store working hours for each day
  },
  isAvailable: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Staff;