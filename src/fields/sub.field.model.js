const mongoose = require('mongoose');

const { Schema } = mongoose;

const subfieldSchema = new Schema({
  field: {
    type: String,
    trim: true,
  },
  subfield: {
    type: String,
    trim: true,
  },
});
const SubField = mongoose.model('Subfield', subfieldSchema);

module.exports = SubField;
