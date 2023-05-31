const mongoose = require('mongoose');

const { Schema } = mongoose;

const repostSchema = new Schema({
  repostAuthor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  repostCommentary: {
    type: String,
    trim: true,
  },
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'Feed',
  },
  likes: {
    type: Number,
    default: 0,
    trim: true,
  },
});

const Repost = mongoose.model('Repost', repostSchema);

module.exports = Repost;
