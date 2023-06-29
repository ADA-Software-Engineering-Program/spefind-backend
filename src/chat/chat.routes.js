const { Router } = require('express');
const router = Router()

router  
    .get('/history', getChatHistory)


module.exports = router