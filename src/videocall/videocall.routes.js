const { Router } = require('express');
const {
    initiateVideoCall,
    getAllCallLogs,
    getCallWithSpecificUser,
    getSpecificCallLogData
} = require('./videocall.controller');
const { userAuthentication  } = require('../helpers/auth');
const router = Router()

router.use(userAuthentication)

router.post('/initiate', initiateVideoCall)
router.get('/logs', getAllCallLogs)
router.get('/logs/user', getCallWithSpecificUser)
router.get('/logs/data', getSpecificCallLogData)

module.exports = router