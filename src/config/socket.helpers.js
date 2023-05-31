const Chat = require('../user/chat.model');
const User = require('../auth/user.model');
const moment = require('moment');

const addUsers = async ({ senderID, receiverID }, socket) => {
  //   socket.on('message', messages);
  const data = await Chat.find({ senderID: senderID, receiverID: receiverID });
  if (data.length > 0) {
    socket.emit('openChat', { ...data[0] });
  } else {
    console.log(true);
    const chatData = await Chat.find({
      senderID: receiverID,
      receiverID: senderID,
    });
    if (chatData.length > 0) {
      socket.emit('openChat', { ...chatData[0] });
    } else {
      const { username } = await User.findById(receiverID);
      const cordditData = {
        text: `This is the beginning of your chat with ${username}`,
        time: moment().format('MMMM Do YYYY, h:mm a'),
      };
      const newChatData = {};
      newChatData.senderID = senderID;
      newChatData.receiverID = receiverID;
      newChatData.chat = cordditData;

      const newChat = await Chat.create(newChatData);
      socket.emit('message', { ...newChat[0] });
    }
  }
};

// console.log(senderID, receiverID, message);

module.exports = { addUsers };
