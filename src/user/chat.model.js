const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
  senderID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  chat: [
    {
      text: {
        type: String,
        trim: true,
      },
      time: {
        type: String,
        trim: true,
      },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
