const mongoose = require('mongoose');

const { Schema } = mongoose;

const fieldSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
