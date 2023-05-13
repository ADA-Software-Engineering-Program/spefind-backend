const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
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
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
