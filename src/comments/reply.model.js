const mongoose = require('mongoose');

const { Schema } = mongoose;

const replySchema = new Schema({
  replyBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  reply: {
    type: String,
    trim: true,
  },
  likes: {
    type: Number,
    trim: true,
    default: 0,
  },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
