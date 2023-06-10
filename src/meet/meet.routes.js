const { Router } = require('express');
const { generateRTCToken, nocache } = require('./meet.controller');
const router = Router();

router.get('/rtc/:channel/:role/:uid', nocache, generateRTCToken);

module.exports = router;
