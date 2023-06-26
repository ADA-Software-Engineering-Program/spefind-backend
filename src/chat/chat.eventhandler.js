const { ChatRoom, Message } = require("./chat.model")
const { clients } = require('../websocket/clients')
const { User } = require('../auth/user.model')
const { joinRoom, getPreviousMessages, sendChatRoomInviteToClient, addNewMessageToChatRoom } = require('./chat.service')

const initiateChat = async function (req, res) {
    const socket = this;
    const { targetuser_id } = req.data

    if (!targetuser_id) {
        res.send("Missing required field: targetuser_id");
        return;
    }

    const target_user = await User.findById(targetuser_id)
    if (!target_user) {
        res.send('Target user does not exist')
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

    joinRoom(socket, chat_room._id)
    sendChatRoomInviteToClient(targetuser_id, chat_room._id)

    // Notify initiator of chat room id
    res.send(null, { chat_room_id: chat_room._id });

    return;
}

const sendMessageToChatRoom = async function (req, res) {
    const socket = this
    const { chat_room_id, message } = req.data

    const chat_room = await ChatRoom.findById(chat_room_id)
    if (!chat_room) {
        res.send('Chat room does not exist')
        return
    }

    // Check if user is part of chat room
    const user_in_chat_room = chat_room.users.includes(socket.user._id)
    if (!user_in_chat_room) {
        res.send('User is not part of chat room')
        return
    }

    const message_data = { sender_id: socket.user._id, chat_room_id, message }
    const new_message = await addNewMessageToChatRoom(message_data)

    // Notify all users in chat room of new message
    let path = chat_room_id + ':chat:message:new'

    io.to(chat_room_id).emit(path, { message: new_message })

    res.send(null, { message: new_message })
    return
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
        res.send({ error: 'Chat room not found' }); return;
    }

    // Check if user is part of chat room
    if (!chat_room.users.includes(socket.user._id)) {
        res.send({ error: 'User is not a member of this chatroom' }); return;
    }

    // Add user to chat room
    joinRoom(socket, chat_room_id)

    res.send(null, { chat_room })
    return
}

const getPreviousChatRoomMessages = async function (req, res) {
    const socket = this
    const { chat_room_id } = req.data

    const data = await getPreviousMessages(chat_room_id)
    if (data instanceof Error) {
        data.message === 'Chat room not found'
            ? res.send({ error: data.message })
            : res.send({ error: 'An error occured' })
    }

    const { messages, chat_room } = data

    // Check if user is part of chat room
    if (!chat_room.users.includes(socket.user._id)) {
        res.send({ error: 'User is not a member of this chatroom' })
        return;
    }

    res.send(null, { messages })
    return
}

module.exports = (io, socket) => {
    try {
        global.io = io;

        const res = new Map()
        res.send = (error, data) => {
            const response_path = res.path
            const response_data = { error, data }

            if (error) console.log(error);
            socket.emit(response_path, response_data)
        }

        async function socketHandlerMiddleware(data, path) {
            try {
                const socket = this;

                // Get request handler from socket_paths
                const socketRequestHandler = socket_paths[path];

                const req = { user: socket.user, data, path }
                res.path = 'response:' + path;

                // Check if user is authenticated 
                // if authenticated socket.user will be set by auth middleware
                let response = null;
                if (socket.user) {
                    response = await socketRequestHandler.call(socket, req, res);
                    return;
                }
                if (response instanceof Error) { throw response };

                res.send(res.path, { error: 'User is not authenticated' })
            } catch (error) {
                console.log(error)
                res.send(res.path, { error: 'Something went wrong' })
            }
        }

        const socket_paths = {
            "chat:initiate": initiateChat,
            "chat:message:new": sendMessageToChatRoom,
            "chat:message:previous": getPreviousChatRoomMessages,
            "chat:join": joinChatRoom,
        };

        socket.on("chat:initiate",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:initiate"));
        socket.on("chat:message:new",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:message:new"));
        socket.on("chat:message:previous",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:message:previous"));
        socket.on("chat:join",
            (data) => socketHandlerMiddleware.call(socket, data, "chat:join"))

    } catch (error) {
        console.log(error)
    }
}