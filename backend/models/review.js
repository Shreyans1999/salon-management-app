const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

const Review = sequelize.define('Review', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: Sequelize.TEXT
  },
  staffResponse: {
    type: Sequelize.TEXT
  }
});

module.exports = Review;