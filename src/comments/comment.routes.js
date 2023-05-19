const { Router } = require('express');
const { createComment } = require('./comment.controllers');
const router = Router();

router.post('/make', createComment);

module.exports = router;
