const mongoose = require('mongoose');

const { Schema } = mongoose;

const feedSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    trim: true,
  },
  feedPhotos: { type: [String], trim: true },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
