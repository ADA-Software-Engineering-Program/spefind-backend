const mongoose = require('mongoose');

const { Schema } = mongoose;

const replySchema = new Schema({
  author: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  // commentId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Comment',
  // },
  reply: {
    type: String,
    trim: true,
  },
  replyLikes: {
    type: Number,
    trim: true,
    default: 0,
  },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
