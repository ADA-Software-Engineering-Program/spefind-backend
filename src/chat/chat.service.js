const { ChatRoom } = require("./chat.model")

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

module.exports = {
    joinRoom,
    getPreviousMessages
}
