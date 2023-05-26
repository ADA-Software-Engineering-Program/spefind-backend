const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  author: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'Feed',
  },
  commentary: {
    type: String,
    trim: true,
  },
  likes: {
    type: Number,
    trim: true,
  },
  replies: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    trim: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
