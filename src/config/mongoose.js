const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('../helpers/logger');
const { DB_URL } = require('./keys');

const connectToDatabase = () => {
  mongoose.connect(DB_URL);
  const database = mongoose.connection;
  database.on('connected', async () => {
    logger.info('Database now Connected...');
  });

  mongoose.connection.on('error', (err) => {
    logger.info('An error occurred while connecting to MongoDB', err);
  });
};

module.exports = { connectToDatabase };
