const fieldService = require('./field.service');

const catchAsync = require('express-async-handler');

const createField = catchAsync(async (req, res) => {
  const data = await fieldService.createField(req.body);
  res.status(200).json({ status: true, data });
});

const getField = catchAsync(async (req, res) => {
  const data = await fieldService.getField(req.params._id);
  res.status(200).json({ status: 'success', data });
});

const getFields = catchAsync(async (req, res) => {
  const data = await fieldService.getFields();
  res
    .status(201)
    .json({ status: true, message: 'All fields retrieved...', data });
});

module.exports = { createField, getFields, getField };
