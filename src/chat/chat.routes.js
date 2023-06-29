const { Router } = require('express');
const { getChatRoomMessages } = require('./chat.controller');
const { userAuthentication, checkUserExistence } = require('../helpers/auth');
const router = Router()

router.use(userAuthentication)

router
    .get('/history', getChatHistory)
    .get('/history/specific', getSpecificChatHistory)
    .get('/messages', getChatRoomMessages)

module.exports = router