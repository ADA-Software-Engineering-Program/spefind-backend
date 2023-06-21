const mongoose = require('mongoose');

const { Schema } = mongoose;

const repostSchema = new Schema(
  {
    repostAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    repostContent: {
      type: String,
      trim: true,
      default: null,
    },
    repostLikes: {
      type: Number,
      default: 0,
      trim: true,
    },

    numberOfRepostComments: {
      type: Number,
      trim: true,
      default: 0,
    },
    numberOfTimesReposted: {
      type: Number,
      trim: true,
      default: 0,
    },
    likedBy: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    feed: {
      type: Schema.Types.ObjectId,
      ref: 'Feed',
    },
    numberOfViews: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Repost = mongoose.model('Repost', repostSchema);

module.exports = Repost;
