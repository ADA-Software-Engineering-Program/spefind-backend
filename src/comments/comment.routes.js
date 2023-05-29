const { Router } = require('express');
const {
  createComment,
  likeComment,
  replyComment,
  unlikeComment,
  likeReply,
} = require('./comment.controllers');
const { userAuthentication } = require('../helpers/auth');
const router = Router();

router.post('/make', createComment);

router.put('/like', likeComment);

router.put('/unlike', unlikeComment);

router.post('/reply/:_commentId', replyComment);

router.put('/like/reply', likeReply);

module.exports = router;
