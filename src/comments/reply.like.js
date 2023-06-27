const mongoose = require('mongoose');

const { Schema } = mongoose;

const replyLikeSchema = new Schema({
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reply: {
    type: Schema.Types.ObjectId,
    ref: 'Reply',
  },
  commentary: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'Feed',
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});

const ReplyLike = mongoose.model('replyLike', replyLikeSchema);

module.exports = ReplyLike;
