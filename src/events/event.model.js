const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  nameOfEvent: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  numberOfAttendees: {
    type: Number,
    trim: true,
  },
  field: {
    type: String,
    trim: true,
  },
  eventPhoto: {
    type: String,
    trim: true,
  },
});
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
