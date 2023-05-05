const mongoose = require('mongoose');

const { Schema } = mongoose;

const fieldSchema = new Schema({
  field: {
    type: String,
    trim: true,
  },
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
