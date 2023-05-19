const commentService = require('./comment.service');
const catchAsync = require('express-async-handler');

const createComment = catchAsync(async (req, res) => {
  const data = await commentService.createComment(
    req.user._id,
    req.body,
    req.query.feedId
  );

  res
    .status(200)
    .json({ status: 'success', message: 'comment successfully added...' });
});

module.exports = { createComment };
