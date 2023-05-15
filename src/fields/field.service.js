const Field = require('./field.model');
const EventType = require('../events/event-type.model');
const State = require('../events/state.model');
const Pricing = require('../events/pricing.model');
const SubField = require('./sub.field.model');

const seedField = async (data) => {
  return await Field.create(data);
};

const createSubfield = async (data) => {
  return await SubField.create(data);
};

const getSubfields = async () => {
  return await SubField.find();
};

const getFields = async () => {
  return await Field.find();
};

const createEventType = async (data) => {
  return await EventType.create(data);
};

const getEventTypes = async () => {
  return await EventType.find();
};

const createState = async (data) => {
  return await State.create(data);
};

const getStates = async () => {
  return await State.find();
};

const createPricing = async (data) => {
  return await Pricing.create(data);
};

const getPricing = async () => {
  return await Pricing.find();
};

module.exports = {
  seedField,
  getFields,
  getStates,
  createEventType,
  createState,
  createEventType,
  createPricing,
  getSubfields,
  getPricing,
  getEventTypes,
  createSubfield,
};
