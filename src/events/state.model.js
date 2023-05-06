const mongoose = require('mongoose');

const { Schema } = mongoose;

const stateSchema = new Schema({
  state: {
    type: String,
    trim: true,
  },
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
