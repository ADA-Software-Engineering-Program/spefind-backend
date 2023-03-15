const mongoose = require('mongoose');

const { Schema } = mongoose;

const followerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  followers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    ],
  },
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;
