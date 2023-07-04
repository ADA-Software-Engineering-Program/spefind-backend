const User = require("../auth/user.model")
const { BadRequestError, NotFundError } = require("../helpers/error")
const catchAsync = require('express-async-handler');
const { clients } = require("../websocket/clients");
const { Call } = require("./videocall.model");

const initiateVideoCall = catchAsync(async (req, res, next) => {
    const { target_user_id, channel_name } = req.body

    if (!target_user_id || !channel_name) {
        throw new BadRequestError('Missing required parameter in request')
    }

    const target_user = await User.findById(target_user_id)
    if (!target_user) {
        throw new BadRequestError('Target user not found')
    }

    const caller = await User.findById(req.user._id)

    // Notify target user of incoming call
    const call_info = {
        channel_name,
        caller_info: {
            user_id: caller._id.toString(),
            first_name: caller.firstName,
            last_name: caller.lastName,
            username: caller.username,
        }
    }

    const target_client = clients.get(target_user.email)
    if (!target_client) {
        throw new BadRequestError('Target user is not online')
    }

    let call_log = await Call.findOne({ participants: { $all: [caller._id, target_user._id] } })
    
    if (!call_log) {
        call_log = await Call.create({
            participants: [caller._id, target_user._id],
            isActive: true,
            channel_name
        })
    }

    target_client.emit('response:call:incoming', { data: call_info })

    res.status(200).send({ message: 'Call initiated', success: true, data: { call_log } })
})

const getAllCallLogs = catchAsync(async (req, res, next) => {
    const { user } = req

    const call_logs = await Call
        .find({ participants: { $in: [user._id] } })
        .populate({
            path: 'participants',
            select: 'firstName lastName username email'
        })

    res.status(200).send({
        success: true,
        data: {
            call_logs
        }
    })
})

const getCallWithSpecificUser = catchAsync(async (req, res, next) => {
    const { user } = req
    const { targetuser_id } = req.query

    const call_logs = await Call
        .find({ participants: { $all: [user._id, targetuser_id] } })
        .populate({
            path: 'participants',
            select: 'firstName lastName username email'
        })

    res.status(200).send({
        success: true,
        data: {
            call_logs
        }
    })
})

const getSpecificCallLogData = catchAsync(async (req, res, next) => {
    const { call_log_id } = req.query

    const call_log = await Call
        .findById(call_log_id)
        .populate({
            path: 'participants',
            select: 'firstName lastName username email'
        })
    if (!call_log) {
        throw new NotFoundError('Call log not found')
    }

    res.status(200).send({
        success: true,
        data: {
            call_log
        }
    })
})
module.exports = {
    initiateVideoCall,
    getAllCallLogs,
    getCallWithSpecificUser,
    getSpecificCallLogData
}