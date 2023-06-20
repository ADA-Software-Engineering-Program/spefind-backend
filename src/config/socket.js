const User = require('../auth/user.model');
const Chat = require('../user/chat.model');
const { RtcRole, RtcTokenBuilder } = require('agora-access-token');
const RandomMeet = require('../meet/meet.model');
const { AGORA_APP_ID, AGORA_CERTIFICATE } = require('../config/keys');
const { addUsers, SocketAuth } = require('./socket.helpers');
const moment = require('moment');
const agoraAppID = Buffer.from(JSON.stringify(AGORA_APP_ID));
const agoraCertificate = Buffer.from(JSON.stringify(AGORA_CERTIFICATE));
module.exports = (io) => {
  io.use(SocketAuth);
  io.on('connection', (socket) => {
    console.log('Sockets now connected...', socket.id);

    socket.on('startUniqueChat', ({ senderID, receiverID }) => {
      addUsers({ senderID, receiverID }, socket);
      // console.log(senderID, receiverID, message);
      // socket.emit('message', 'All is well everyday...');
    });

    const generateTokenDetails = () => {
      let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
      let channelName = `CORDDIT-${code}`;
      let UIDCode = Math.floor(Math.random() * (9999 - 1000) + 1000);
      let UID = `${UIDCode}`;
      let role = RtcRole.PUBLISHER;
      const currentTime = Math.floor(Date.now() / 1000);
      let expireTime = 3600;
      const privilegeExpireTime = currentTime + expireTime;

      let token = RtcTokenBuilder.buildTokenWithUid(
        agoraAppID,
        agoraCertificate,
        channelName,
        UID,
        role,
        privilegeExpireTime
      );
      let generatedToken = { channelName, UID, token };
      return generatedToken;
    };

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
      let generatedToken = await generateTokenDetails();
      console.log('talkie');
      socket.emit('generatedToken', { ...generatedToken });
    });

    socket.on('availableToPair', async () => {
      const checkUser = await RandomMeet.findOne({
        participant: socket.user.user._id,
      });

      const checkPairing = await RandomMeet.findOne({
        isAvailable: true,
        isPaired: false,
      });
      const criteria = { isAvailable: true, isPaired: false };
      let pairedUser;
      if (!checkPairing) {
        socket.emit('message', {
          response:
            'There is no available user to be paired with at the moment..',
        });
      } else {
        const checkList = await RandomMeet.find({
          isAvailable: true,
          isPaired: false,
        });
        console.log(checkList[0]);
        pairedUser = checkList[0].participant;
      }
      await RandomMeet.findOneAndUpdate(
        { participant: pairedUser },
        { isPaired: true },
        { new: true }
      );
      const { socketId } = await RandomMeet.findOne({
        participant: pairedUser,
      });

      io.sockets
        .socket(socketId)
        .emit('message', 'You have just been paired for a random meet');

      console.log(pairedUser);

      if (checkUser) {
        await RandomMeet.findOneAndUpdate(
          { participant: socket.user.user._id },
          { socketId: socket.id },
          { new: true }
        );
      } else {
        await RandomMeet.create({
          participant: socket.user.user._id,
          isAvailable: true,
          socketId: socket.id,
        });
      }

      socket.emit('message', {
        response: `Your indication to pair was received! You have just been paired with ${pairedUser}. `,
      });
    });
    socket.on('disconnect', async () => {
      await RandomMeet.findOneAndUpdate(
        { socketId: socket.id },
        { isAvailable: false, isPaired: false }
      );
    });
  });
};
