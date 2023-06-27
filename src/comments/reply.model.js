const mongoose = require('mongoose');

const { Schema } = mongoose;

const replySchema = new Schema(
  {
    author: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    feed: {
      type: Schema.Types.ObjectId,
      ref: 'Feed',
    },
    reply: {
      type: String,
      trim: true,
    },
    replyLikes: {
      type: Number,
      trim: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
