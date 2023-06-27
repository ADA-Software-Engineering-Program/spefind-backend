const commentService = require('./comment.service');
const catchAsync = require('express-async-handler');

const createComment = catchAsync(async (req, res) => {
  await commentService.createComment(req.user._id, req.body, req.query.feedId);
  res
    .status(200)
    .json({ status: 'success', message: 'comment successfully added...' });
});

const getAllComments = catchAsync(async (req, res) => {
  const data = await commentService.getComments(req.user._id, req.query.feedId);
  res.status(202).json({
    status: true,
    message: 'All comments for feed retrieved...',
    data,
  });
});

const likeComment = catchAsync(async (req, res) => {
  await commentService.likeComment(req.user._id, req.params._id);
  res
    .status(200)
    .json({ status: 'success', message: 'You liked this comment...' });
});

const unlikeComment = catchAsync(async (req, res) => {
  await commentService.unlikeComment(req.user._id, req.params._id);
  res
    .status(200)
    .json({ status: 'success', message: 'You unliked this comment...' });
});

const replyComment = catchAsync(async (req, res) => {
  await commentService.replyComment(
    req.user._id,
    req.params._commentId,
    req.body.reply
  );

  res.status(200).json({ status: true, message: 'You replied a comment...' });
});

const likeReply = catchAsync(async (req, res) => {
  await commentService.likeReply(req.query.replyId);
  res.status(201).json({ status: 'success', message: 'You liked a reply' });
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteComment(req.query.commentId);

  res
    .status(200)
    .json({ status: 'success', message: 'Comment successfully deleted...' });
});

const deleteReply = catchAsync(async (req, res) => {
  await commentService.deleteReply(req.query.replyId);

  res
    .status(200)
    .json({ status: true, message: 'Reply successfully deleted...' });
});

module.exports = {
  createComment,
  replyComment,
  likeReply,
  likeComment,
  unlikeComment,
  getAllComments,
  deleteComment,
  deleteReply,
};
