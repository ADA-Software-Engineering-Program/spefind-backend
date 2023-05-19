const mongoose = require('mongoose');

const { Schema } = mongoose;

const followingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: null,
  },
});

const Following = mongoose.model('Following', followingSchema);

module.exports = Following;
