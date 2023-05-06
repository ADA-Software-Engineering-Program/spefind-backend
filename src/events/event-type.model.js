const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventTypeSchema = new Schema({
  eventType: {
    type: String,
  },
});

const EventType = mongoose.model('EventType', eventTypeSchema);

module.exports = EventType;
