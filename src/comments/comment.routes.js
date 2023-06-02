const { Router } = require('express');
const {
  createComment,
  likeComment,
  replyComment,
  unlikeComment,
  likeReply,
  getAllComments,
} = require('./comment.controllers');
const { userAuthentication } = require('../helpers/auth');
const router = Router();

router.post('/make', createComment);

router.get('/all', getAllComments);

router.put('/like/:_id', likeComment);

router.put('/unlike', unlikeComment);

router.post('/reply/:_commentId', replyComment);

router.put('/like/reply', likeReply);

module.exports = router;
