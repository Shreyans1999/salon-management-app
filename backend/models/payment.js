const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  transactionId: {
    type: Sequelize.STRING
  }
});

module.exports = Payment;