const Field = require('./field.model');

const seedField = async (data) => {
  return await Field.create(data);
};

const getFields = async () => {
  return await Field.find();
};

module.exports = { seedField, getFields };
