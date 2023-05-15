const mongoose = require('mongoose');

const { Schema } = mongoose;

const subfieldSchema = new Schema({
  field: {
    type: Schema.Types.ObjectId,
    ref: 'Field',
  },
  subfield: {
    type: String,
    trim: true,
  },
});
const SubField = mongoose.model('Subfield', subfieldSchema);

module.exports = SubField;
