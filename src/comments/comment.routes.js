const { Router } = require('express');
const {
  createComment,
  reactToComment,
  replyComment,
  unlikeComment,
  reactToReply,
  deleteReply,
  deleteComment,
  getReplies,
  getAllComments,
} = require('./comment.controllers');

const router = Router();

// Comment Endpoints

router.post('/make', createComment);

router.get('/all', getAllComments);

router.delete('/delete', deleteComment);

router.put('/:react/:_id', reactToComment);

// Reply Endpoints

router.post('/reply/:_commentId', replyComment);

router.patch('/:react/reply', reactToReply);

router.get('/replies/all', getReplies);

router.delete('/reply/delete', deleteReply);

module.exports = router;
