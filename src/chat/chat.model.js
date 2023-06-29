const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    users: { type: [Schema.Types.ObjectId], ref: 'User', required: true },
    messages: { type: [Schema.Types.ObjectId], ref: 'Message', default: [] }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    chat_room: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
    message: { type: String, required: true },
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { ChatRoom, Message };
