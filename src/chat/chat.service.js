const { ChatRoom, Message } = require("./chat.model")

function joinRoom(client, room_id) {
    room_id = room_id.toString()

    const client_in_chatroom = room_id in client.rooms
    if (!client_in_chatroom) {
        client.join(room_id)
    }
}

async function getPreviousMessages(chat_room_id) {
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

    if (!chat_room) { throw new Error('Chat room not found') }

    // Check if chat room exists
    return { messages: chat_room.messages || [], chat_room }
}

async function sendChatRoomInviteToClient(target_user_id, room_id) {
    const target_user_data = await User.findById(target_user_id);

    const target_client = clients.get(target_user_data.email)
    const client_in_chatroom = room_id in target_client.rooms

    // Send invite to target client if not already in room
    if (!client_in_chatroom) {
        target_client.emit("chat:invitation", { chat_room_id: room_id });
    }

    return;
}

async function addNewMessageToChatRoom(message_data) {
    const {
        sender_id,
        chat_room_id,
        message
    } = message_data

    const existing_chatroom = await ChatRoom.findById(chat_room_id)
    if (!existing_chatroom) throw new Error('ChatRoom not found')

    let new_message = await Message.create({
        sender: sender_id,
        chat_room: chat_room_id,
        message,
    })

    await existing_chatroom.updateOne({ $addToSet: { messages: new_message._id } })

    const populated_message =
        await new_message.populate({
            path: 'sender',
            select: 'firstname lastname email createdAt'
        })

    return populated_message
}

module.exports = {
    joinRoom,
    getPreviousMessages,
    sendChatRoomInviteToClient,
    addNewMessageToChatRoom
}
