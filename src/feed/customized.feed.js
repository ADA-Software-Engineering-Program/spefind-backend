const mongoose = require('mongoose');

const { Schema } = mongoose;

const customizeFeed = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
  },
  feedAuthor: {
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
  isBlocked: {
    type: Boolean,
    default: false,
    trim: true,
  },
});

const customizedFeed = mongoose.model('userfeed', customizeFeed);

const blockSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
  },
  blockedContacts: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    trim: true,
  },
});

const userBlock = mongoose.model('blockedUser', blockSchema);

module.exports = { customizedFeed, userBlock };
