const catchAsync = require('express-async-handler');
const statService = require('./stat.service');

const getStats = async (req, res) => {
  const data = await statService.getStats();
  res
    .status(200)
    .json({ status: true, message: 'All data now retrieved...', data });
};

module.exports = { getStats };
