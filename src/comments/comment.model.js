const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    feed: {
      type: Schema.Types.ObjectId,
      ref: 'Feed',
    },
    commentary: {
      type: String,
      trim: true,
    },
    repost: {
      type: Schema.Types.ObjectId,
      ref: 'Repost',
    },
    commentLikes: {
      type: Number,
      trim: true,
      default: 0,
    },
    replies: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
      trim: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
