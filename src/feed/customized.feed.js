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
  isPinned: {
    type: Boolean,
    default: false,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const customizedFeed = mongoose.model('userfeed', customizeFeed);

module.exports = customizedFeed;
