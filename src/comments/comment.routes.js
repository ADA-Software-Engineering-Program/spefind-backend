const { Router } = require('express');
const {
  createComment,
  reactToComment,
  replyComment,
  unlikeComment,
  likeReply,
  deleteReply,
  deleteComment,
  getReplies,
  getAllComments,
} = require('./comment.controllers');
const { userAuthentication } = require('../helpers/auth');
const router = Router();

router.post('/make', createComment);

router.get('/replies/all', getReplies);

router.get('/all', getAllComments);

router.put('/:react/:_id', reactToComment);

router.put('/unlike/:_id', unlikeComment);

router.post('/reply/:_commentId', replyComment);

router.put('/like/reply', likeReply);

router.delete('/delete', deleteComment);

router.delete('/reply/delete', deleteReply);

module.exports = router;
