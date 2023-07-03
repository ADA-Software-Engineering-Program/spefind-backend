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

const reactToComment = catchAsync(async (req, res) => {
  if (req.params.react === 'like') {
    await commentService.likeComment(req.user._id, req.params._id);
    return res
      .status(200)
      .json({ status: 'success', message: 'You liked this comment...' });
  } else {
    await commentService.unlikeComment(req.user._id, req.params._id);
    res
      .status(200)
      .json({ status: 'success', message: 'You unliked this comment...' });
  }
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

const reactToReply = catchAsync(async (req, res) => {
  if (req.params.react === 'like') {
    await commentService.likeReply(req.user._id, req.query.replyId);
    return res
      .status(201)
      .json({ status: 'success', message: 'You liked a reply' });
  }
  await commentService.unlikeReply(req.user._id, req.query.replyId);
  res.status(201).json({ status: 'success', message: 'You unliked a reply' });
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteComment(req.query.commentId);

  res
    .status(200)
    .json({ status: 'success', message: 'Comment successfully deleted...' });
});

const getReplies = catchAsync(async (req, res) => {
  const data = await commentService.getReplies(
    req.user._id,
    req.query.commentId
  );
  res.status(200).json({
    status: true,
    message: 'All replies for comments retrieved...',
    data,
  });
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
  reactToReply,
  reactToComment,
  unlikeComment,
  getReplies,
  getAllComments,
  deleteComment,
  deleteReply,
};
