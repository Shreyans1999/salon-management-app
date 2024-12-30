const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  time: {
    type: Sequelize.TIME,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  notes: {
    type: Sequelize.TEXT
  }
});

module.exports = Appointment;