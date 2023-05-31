const User = require('../auth/user.model');
const Chat = require('../user/chat.model');
const { addUsers } = require('./socket.helpers');
const moment = require('moment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Sockets now connected...', socket.id);

    socket.on('startUniqueChat', ({ senderID, receiverID }) => {
      addUsers({ senderID, receiverID }, socket);
      // console.log(senderID, receiverID, message);
      // socket.emit('message', 'All is well everyday...');
    });

    socket.on('getAllChats', async ({ userId }) => {
      let allChats = [];
      const checkChat = await Chat.find({ senderID: userId });
      if (checkChat) {
        allChats = [...checkChat];
      }
      const checkChats = await Chat.find({ receiverID: userId });
      if (checkChats) {
        allChats = [...checkChats];
      }
    });

    socket.on('sendMessage', async ({ senderID, receiverID, message }) => {
      console.log(senderID, receiverID, message);
      const checkPreviousChat_1 = await Chat.find({
        senderID: senderID,
        receiverID: receiverID,
      });
      const checkPreviousChat_2 = await Chat.find({
        senderID: receiverID,
        receiverID: senderID,
      });
      const cordditData = {
        text: message,
        time: moment().format('MMMM Do YYYY, h:mm a'),
      };

      if (checkPreviousChat_1.length <= 0 && checkPreviousChat_2.length <= 0) {
        console.log('tell me...');
        const { firstName } = await User.findById(receiverID);
        const cordditData = {
          text: message,
          time: moment().format('MMMM Do YYYY, h:mm a'),
        };
        const newChatData = {};
        newChatData.senderID = senderID;
        newChatData.receiverID = receiverID;
        newChatData.chat = cordditData;
        const newChat = await Chat.create(newChatData);

        socket.emit('message', newChat);
      }
      if (checkPreviousChat_1.length > 0) {
        const returnedData = await Chat.findByIdAndUpdate(
          checkPreviousChat_1[0]._id,
          {
            $push: { chat: cordditData },
          },
          { new: true }
        );
        socket.emit('message', returnedData);
      }
      if (checkPreviousChat_2.length > 0) {
        const returnedData = await Chat.findByIdAndUpdate(
          checkPreviousChat_2[0]._id,
          {
            $push: { chat: cordditData },
          },
          { new: true }
        );
        socket.emit('message', { ...returnedData });
      }
    });
  });
};
