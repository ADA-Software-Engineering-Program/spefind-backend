const mongoose = require('mongoose');

const { Schema } = mongoose;

const randomMeetSchema = new Schema({
  participant: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
    trim: true,
  },
  isPaired: {
    type: Boolean,
    default: false,
  },
});

const RandomMeet = mongoose.model('pairing', randomMeetSchema);

module.exports = RandomMeet;
