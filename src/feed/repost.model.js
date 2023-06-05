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
    feed: {
      type: Schema.Types.ObjectId,
      ref: 'Feed',
    },
    likedBy: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
  },
  { timestamps: true }
);

const Repost = mongoose.model('Repost', repostSchema);

module.exports = Repost;
