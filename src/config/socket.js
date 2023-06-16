const User = require('../auth/user.model');
const Chat = require('../user/chat.model');
const { RtcRole, RtcTokenBuilder } = require('agora-access-token');
const { AGORA_APP_ID, AGORA_CERTIFICATE } = require('../config/keys');
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
    socket.on('generateAgoraToken', async () => {
      let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
      let channelName = `CORDDIT-${code}`;
      let UIDCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
      let UID = UIDCode;
      let role = 'publisher';
      let expiry = 3600;
      let token = await RtcTokenBuilder.buildTokenWithAccount(
        AGORA_APP_ID,
        AGORA_CERTIFICATE,
        channelName,
        role,
        expiry
      );
      let generatedToken = { channelName, UID, token };
      socket.emit('generatedToken', { ...generatedToken });
    });
  });
};
