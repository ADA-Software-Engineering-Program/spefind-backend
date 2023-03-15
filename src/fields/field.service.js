const Field = require('./field.model');

const createField = async (data) => {
  return await Field.create(data);
};

const getField = async (id) => {
  return await Field.findById(id);
};

const getFields = async () => {
  return await Field.find().sort({ _id: -1 });
};

module.exports = { createField, getField, getFields };
