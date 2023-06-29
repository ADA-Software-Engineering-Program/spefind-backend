const { ChatRoom, Message } = require("./chat.model")
const { clients } = require('../websocket/clients')
const User = require('../auth/user.model')
const { joinRoom, getPreviousMessages, sendChatRoomInviteToClient, addNewMessageToChatRoom } = require('./chat.service')
const logger = require("../helpers/logger")

const initiateChat = async function (req, res) {
    const socket = this;
    const { targetuser_id } = req.data

    if (!targetuser_id) {
        res.error("Missing required field: targetuser_id");
        return;
    }

    const target_user = await User.findById(targetuser_id)
    if (!target_user) {
        res.error('Target user does not exist')
        return
    }

    const populate_config = {
        path: "messages",
        populate: { path: "sender", select: "email firstname lastname" },
    };

    const existing_chatroom =
        await ChatRoom
            .findOne({ users: { $all: [socket.user._id, targetuser_id] } })
            .populate(populate_config)

    let chat_room =
        existing_chatroom
            ? existing_chatroom
            : await ChatRoom.create({ users: [socket.user._id, targetuser_id] });

    logger.info('joining chatroom')
    joinRoom(socket, chat_room._id)

    logger.info('sending chatroom invite')
    await sendChatRoomInviteToClient(targetuser_id, chat_room._id).catch((err) => {
        if (err.message != 'Target client is not connected') {
            throw err
        }
    })

    // Notify initiator of chat room id
    res.send({ chat_room: chat_room });

    return;
}

const sendMessageToChatRoom = async function (req, res) {
    const socket = this
    const { chat_room_id, message } = req.data

    if (!chat_room_id || !message) {
        res.error('Missing required parameter in request')
        return
    }

    const chat_room = await ChatRoom.findById(chat_room_id)
    if (!chat_room) {
        res.error('Chat room not found')
        return
    }

    // Check if user is part of chat room
    const user_in_chat_room = chat_room.users.includes(socket.user._id)
    if (!user_in_chat_room) {
        res.error('Not a member of Chat room')
        return
    }

    const message_data = { sender_id: socket.user._id, chat_room_id, message }
    console.log(message_data)
    const new_message = await addNewMessageToChatRoom(message_data)

    // Notify all users in chat room of new message
    let path = 'chat:message:incoming:' + chat_room_id
    logger.info('incomming messge path => ' + path)
    logger.info('sending message')
    io.to(chat_room_id).emit('message:incoming', { message: new_message })

    io.rooms

    res.send({ message: new_message })
    return
}

const getChatRoomData = async function (req, res) {
    const socket = this
    const { chat_room_id } = req.data

    const chat_room = await ChatRoom.findById(chat_room_id).populate('messages')
    if (!chat_room) {
        res.error('Chat room does not exist')
        return
    }

    // Check if user is part of chat room
    const user_in_chat_room = chat_room.users.includes(socket.user._id)
    if (user_in_chat_room) {
        res.error('User is not a member of chat room')
        return
    }

    res.send({ chat_room })
}

const joinChatRoom = async function (req, res) {
    const socket = this
    const { chat_room_id } = req.data

    const chat_room = await
        ChatRoom
            .findById(chat_room_id)
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'email firstname lastname'
                }
            })

    // Check if chat room exists
    if (!chat_room) {
        res.error('Chat room not found'); return;
    }

    // Check if user is part of chat room
    if (!chat_room.users.includes(socket.user._id)) {
        res.send({ error: 'User is not a member of this chatroom' }); return;
    }

    // Add user to chat room
    joinRoom(socket, chat_room_id)

    res.send({ chat_room })
    return
}

const getPreviousChatRoomMessages = async function (req, res) {
    logger.info('inside')
    const socket = this
    const { chat_room_id } = req.data

    const data = await getPreviousMessages(chat_room_id)
    if (data instanceof Error) {
        data.message === 'Chat room not found'
            ? res.error(data.message)
            : res.error('An error occured')
    }

    const { messages, chat_room } = data

    // Check if user is part of chat room
    if (!chat_room.users.includes(socket.user._id)) {
        res.error('User is not a member of this chatroom')
        return;
    }

    logger.info('returning response')
    res.send({ messages })
    return
}

const subscribeToUsersChatrooms = async function () {
    logger.info('inside')
    const socket = this
    const { user } = socket

    const chatrooms = await ChatRoom.find({ users: { $in: [user._id.toString()] } })

    console.log(chatrooms)
}

class SocketResponseObject {
    constructor(socket, path) {
        this.socket = socket
        this.response_path = 'response:' + path
    }

    send = (data) => {
        logger.info(data)
        const response_path = this.path
        logger.info(response_path)
        const response_data = { data }

        this.socket.emit(this.response_path, response_data)
    }

    error = (err) => {
        const response_path = this.path
        const error = { error: err }

        this.socket.emit(this.response_path, error)
    }
}
module.exports = async (io, socket) => {
    try {
        global.io = io;


        async function socketHandlerMiddleware(data, path) {
            try {
                const socket = this;
                const res = new SocketResponseObject(socket, path)

                // Get request handler from socket_paths
                const socketRequestHandler = socket_paths[path];

                // TODO: Join all connected chatrooms

                const req = { user: socket.user, data, path }

                let response = socket.user
                    ? await socketRequestHandler.call(socket, req, res)
                    : null
                    
                if (response instanceof Error) { throw response };

                res.error('User is not authenticated')
            } catch (error) {
                console.log(error)
                res.error({ message: 'Something went wrong' })
            }
        }
        const socket_paths = {
            "chat:initiate": initiateChat,
            "chat:message:new": sendMessageToChatRoom,
            "chat:message:previous": getPreviousChatRoomMessages,
            "chat:join": joinChatRoom,
            "chat:data": getChatRoomData
        };

        await subscribeToUsersChatrooms.call(socket)

        socket.on("chat:initiate",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:initiate"));
        socket.on("chat:message:new",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:message:new"));
        socket.on("chat:message:previous",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:message:previous"));
        socket.on("chat:data",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:data"));
        socket.on("chat:join",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:join"))

    } catch (error) {
        logger.error(error)
    }
}
