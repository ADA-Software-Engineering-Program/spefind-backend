const fieldService = require('./field.service');
const catchAsync = require('express-async-handler');

const createField = catchAsync(async (req, res) => {
  const data = await fieldService.seedField(req.body);

  res.status(200).json({ status: true, message: 'Field now seeded', data });
});

const getAllFields = catchAsync(async (req, res) => {
  const data = await fieldService.getFields();
  res
    .status(201)
    .json({ status: true, message: 'All Fields now retrieved', data });
});

module.exports = { createField, getAllFields };
