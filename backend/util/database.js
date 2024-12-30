const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // SSL configuration for production
        ...(process.env.NODE_ENV === 'production' && {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        })
    }
);

// Test database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

// Sync all models
// Note: In production, you should use migrations instead
if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database synchronized');
        })
        .catch(err => {
            console.error('Error synchronizing database:', err);
        });
}

module.exports = sequelize;