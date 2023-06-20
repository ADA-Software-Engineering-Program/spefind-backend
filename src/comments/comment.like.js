const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentLikeSchema = new Schema({
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

const CommentLike = mongoose.model('commentLike', commentLikeSchema);

module.exports = CommentLike;
