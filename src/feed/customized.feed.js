const mongoose = require('mongoose');

const { Schema } = mongoose;

const customizeFeed = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
  },
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'Feed',
    trim: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
    trim: true,
  },
});

const customizedFeed = mongoose.model('userfeed', customizeFeed);

module.exports = customizedFeed;
