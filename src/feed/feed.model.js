const mongoose = require('mongoose');
const { FEED_TYPE, getEnumsArray } = require('../helpers/enums');
const { Schema } = mongoose;

const feedSchema = new Schema(
  {
    author: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    content: {
      type: String,
      trim: true,
    },
    feedPhotos: { type: [String], trim: true },

    feedLikes: {
      type: Number,
      default: 0,
    },
    feedType: {
      type: String,
      enum: [...getEnumsArray(FEED_TYPE)],
      trim: true,
    },
    feed: {
      type: Schema.Types.ObjectId,
      ref: 'Feed',
      default: null,
    },

    numberOfComments: {
      type: Number,
      trim: true,
      default: 0,
    },
    numberOfReposts: {
      type: Number,
      trim: true,
      default: 0,
    },
    likedBy: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    numberOfViews: {
      type: Number,
      trim: true,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
