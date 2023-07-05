const { ChatRoom, Message } = require("./chat.model")
const { clients } = require('../websocket/clients')
const User = require('../auth/user.model')
const {
    joinRoom, getPreviousMessages,
    sendChatRoomInviteToClient,
    addNewMessageToChatRoom
} = require('./chat.service')
const logger = require("../helpers/logger")

const initiateChat = async function (req, res) {
    const socket = this;
    const { targetuser_id } = req.data
    console.log(req.data)

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
    io.to(chat_room_id).emit('response:message:incoming', { message: new_message })

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
    const user_in_chat_room = chat_room.users.includes(socket.user._id.toString())
    if (!user_in_chat_room) {
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

const updateTypingStatus = async function(req, res)  {
    const  socket = this
    const { status, chat_room_id } = req.data


    if (!status || !chat_room_id) {
        res.error('Missing required fields')
        return
    }

    if (status !== 'typing' || status !== 'not-typing') {
        res.error('invalid typing status')
        return
    }

    const existing_chat_room = await ChatRoom.findOne({_id: chat_room_id})
    if (!existing_chat_room) {
        res.error('Chat room not found')
        return
    }

    const user_is_member = existing_chat_rom.members.includes(socket.user._id)
    if (!user_is_member) {
        res.error('User is not a member of this chat room')
        return
    }

    const target_user_id = existing_chat_room.users.filter((user) => user !== socket.user._id)[0]
    const target_user = await User.findOne({ _id: target_user_id})
    const target_user_socket = clients.get(target_user.email)
    if (target_user_socket) {
        target_user_socket.emit('response:chat:typingstatus', { status, chat_room_id })
    }

    res.send({
        success: true,
        message: 'Typping status updated successfully'
    })

 }

const subscribeToUsersChatrooms = async function (socket) {
    const { user } = socket

    const chatrooms = await ChatRoom.find({ users: { $in: [user._id.toString()] } })

    chatrooms.forEach((chatroom) => {
        const chatroom_id = chatroom._id

        joinRoom(socket, chatroom_id.toString())
    })
}

class SocketResponseObject {
    response_path

    constructor(socket, path) {
        this.socket = socket
        this.response_path = 'response:' + path

        console.log('----> main ' + this.response_path)
        console.log('----> main ' + path)
    }

    send = (data) => {
        logger.info('data', data)
        const response_path = this.path
        logger.info('responsepath', response_path)
        const response_data = { data }

        this.socket.emit(this.response_path, response_data)
    }

    error = (err) => {
        const response_path = this.response_path
        const error = { error: err }

        this.socket.emit(response_path, error)
    }
}

class SocketRequestObject {
    constructor(socket, path, data) {
        this.user = socket.user
        this.data = data
        this.path = path
    }

    user = this.user
    data = this.data
    path = this.path
}

class SocketRouter {
    constructor(socket) {
        this.socket = socket;
        this.route = {};
    }

    handleSocketEvent(eventName, callback) {
        this.socket.on(eventName, (data) => {
            console.log('eventname1', eventName)
            this.socketHandlerMiddleware(data, eventName);
        });
    }

    init(route) {
        this.route = route;

        for (const eventName in this.route) {
            if (this.route.hasOwnProperty(eventName)) {
                this.handleSocketEvent(eventName, this.route[eventName]);
            }
        }
    }

    async socketHandlerMiddleware(data, path) {
        try {
            const socket = this.socket;
            const res = new SocketResponseObject(socket, path);
            console.log(path)
            const req = new SocketRequestObject(socket, path, data);

            // Get request handler from route
            const socketRequestHandler = this.getSocketHandlerFunction(path);

            if (socket.user) {
                await socketRequestHandler.call(socket, req, res);
                return
            } else {
                res.error('User is not authenticated');
            }
        } catch (error) {
            res.error({ message: 'Something went wrong' });
        }
    }

    getSocketHandlerFunction(path) {
        return this.route[path] || null;
    }
}

module.exports = async (io, socket) => {
    try {
        global.io = io;

        await subscribeToUsersChatrooms(socket);
        const router = new SocketRouter(socket);

        router.init({
            "chat:initiate": initiateChat,
            "chat:message:new": sendMessageToChatRoom,
            "chat:message:previous": getPreviousChatRoomMessages,
            "chat:join": joinChatRoom,
            "chat:data": getChatRoomData,
            "chat:typingstatus:update": updateTypingStatus,
        });

    } catch (error) {
        logger.error(error);
    }
};