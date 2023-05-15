const fieldService = require('./field.service');
const catchAsync = require('express-async-handler');

const createField = catchAsync(async (req, res) => {
  const data = await fieldService.seedField(req.body);

  res.status(200).json({ status: true, message: 'Field now seeded', data });
});

const createSubfield = async (req, res) => {
  const data = await fieldService.createSubfield(req.body);
  res.status(200).json({ status: true, message: 'Subfield now created', data });
};

const getSubfields = catchAsync(async (req, res) => {
  const data = await fieldService.getSubfields();
  res
    .status(201)
    .json({ status: true, message: 'All subfields now retrieved', data });
});

const getAllFields = catchAsync(async (req, res) => {
  const data = await fieldService.getFields();
  res
    .status(201)
    .json({ status: true, message: 'All Fields now retrieved', data });
});

const createEventType = catchAsync(async (req, res) => {
  const data = await fieldService.createEventType(req.body);
  res
    .status(201)
    .json({ status: true, message: 'Event type now created...', data });
});

const getEventTypes = catchAsync(async (req, res) => {
  const data = await fieldService.getEventTypes();
  res
    .status(201)
    .json({ status: 'success', message: 'All event types retrieved...', data });
});

const createState = catchAsync(async (req, res) => {
  const data = await fieldService.createState(req.body);
  res
    .status(201)
    .json({ status: true, message: 'State successfully added...', data });
});

const getStates = catchAsync(async (req, res) => {
  const data = await fieldService.getStates();
  res
    .status(201)
    .json({ status: 'success', message: 'All states retrieved...', data });
});

const createPricing = catchAsync(async (req, res) => {
  const data = await fieldService.createPricing(req.body);
  res
    .status(201)
    .json({ status: 'success', message: 'Pricing range now created...', data });
});

const getPricing = catchAsync(async (req, res) => {
  const data = await fieldService.getPricing();
  res.status(201).json({
    status: 'success',
    message: 'All pricing info now retrieved...',
    data,
  });
});

module.exports = {
  createField,
  createState,
  getStates,
  getAllFields,
  getSubfields,
  getEventTypes,
  createEventType,
  createPricing,
  createSubfield,
  getPricing,
};
