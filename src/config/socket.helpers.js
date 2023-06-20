const Chat = require('../user/chat.model');
const User = require('../auth/user.model');
const ApiError = require('../helpers/error');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./keys');

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

const SocketAuth = (socket, next) => {
  try {
    const token = socket.handshake.headers.access_token ?? '';
    if (token === '') {
      socket.emit('message', {
        response: 'Oops! Your token is required here...',
      });
      throw new ApiError('Oops! Your token is required here...');
    }
    const decodedToken = jwt.verify(
      token,
      JWT_SECRET,
      (error, decodedToken) => {
        if (error) {
          throw new ApiError(400, 'Ooopss! Your token is probably expired...');
        } else {
          socket.user = decodedToken;
          // console.log(socket.user);
          next();
        }
      }
    );
  } catch (error) {}
};

// console.log(senderID, receiverID, message);

module.exports = { addUsers, SocketAuth };
