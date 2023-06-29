const User = require("../auth/user.model")
const { BadRequestError } = require("../helpers/error")
const { ChatRoom } = require("./chat.model")
const { getPreviousMessages } = require("./chat.service")

const createNewChatRoom = async (req, res, next) => {
    try {
        const { user_ids } = req.body
    
        if (user_ids.length > 2) {
            throw new BadRequestError('Only 2 users can be in a chat room')
        }
    
        const existing_users = await User.find({ _id: { $in: user_ids } })
        const not_all_users_exist = existing_users.length < user_ids.length
        if (not_all_users_exist) {
            return res.status(400).send({
                message: 'Not all users exist'
            })
        }
    
        const users_above_chatroom_limit = existing_users.length > 2
        if (users_above_chatroom_limit) {
            return res.status(400).send({
                message: 'Only 2 users can be in a chatroom'
            })
        }
    
        const chat_room = await ChatRoom.create({
            users: [user_ids]
        })
    
        return res.status(200).json({
            sucess: true,
            message: 'Chatroom created successfully',
            data: {
                chat_room
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'An error occured while creating chatroom'
        })        
    }
}

const getChatRoomMessages = async (req, res, next) => {
    try {
        const { chat_room_id } = req.body
    
        const messages = await getPreviousMessages(chat_room_id)
    
        return res.status(200).json({
            success: true,
            message: "Chat room messages fetched successfully",
            data: {
                messages
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'An error occured while fetching chatroom messages'
        })        
    }
}

const getChatHistory = async (req, res, next) => {
    try {
        const { user } = req
    
        const chat_rooms = await ChatRoom.find({ users: { $in: [user._id] } }).populate('messages')
    
        return res.status(200).json({
            success: true,
            message: 'Chatroom data fetched successfully',
            data: {
                chat_rooms
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'An error occured while fetching chatroom data'
        })        
    }
}

const getSpecificChatHistory = async (req, res, next) => {
    try {
        const { chat_room_id } = req.body
        const chat_room = await ChatRoom.findOne({ _id: chat_room_id}).populate('messages')
    
        return res.status(200).json({
            success: true,
            message: 'Chatroom data fetched successfully',
            data: {
                chat_room
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'An error occured while fetching chatroom data'
        })        
    }
}

module.exports = {
    createNewChatRoom,
    getChatRoomMessages,
    getChatRoomMessages,
    getChatHistory,
    getSpecificChatHistory
}