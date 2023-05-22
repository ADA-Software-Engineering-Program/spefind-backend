const Comment = require('./comment.model');
const ApiError = require('../helpers/error');
const Feed = require('../feed/feed.model');
const Reply = require('./reply.model');

const createComment = async (userId, data, feedId) => {
  try {
    let commentData = data;
    commentData.author = userId;
    commentData.feed = feedId;
    const comment = await Comment.create(commentData);

    const { numberOfComments } = await Feed.findById(feedId);

    const newNumberOfComments = numberOfComments + 1;

    await Feed.findByIdAndUpdate(
      feedId,
      { numberOfComments: newNumberOfComments },
      { new: true }
    );
    return await Feed.findByIdAndUpdate(
      feedId,
      { $push: { comments: comment._id } },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to create comment...');
  }
};

const likeComment = async (commentId) => {
  const { likes } = await Comment.findById(commentId);
  const newNumberOfLikes = likes + 1;
  return await Comment.findByIdAndUpdate(
    commentId,
    { likes: newNumberOfLikes },
    { new: true }
  );
};

const unlikeComment = async (commentId) => {
  const { likes } = await Comment.findById(commentId);
  const newNumberOfLikes = likes - 1;
  return await Comment.findByIdAndUpdate(
    commentId,
    { likes: newNumberOfLikes },
    { new: true }
  );
};

const replyComment = async (userId, commentId, reply) => {
  try {
    const replyData = {};
    replyData.replyBy = userId;
    replyData.commentId = commentId;
    replyData.reply = reply;
    const replyResponse = await Reply.create(replyData);
    return await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: replyResponse._id } },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to reply comment...');
  }
};

const likeReply = async (replyId) => {
  try {
    const { likes } = await Reply.findById(replyId);
    const newNumberOfLikes = likes + 1;
    return await Reply.findByIdAndUpdate(
      replyId,
      { likes: newNumberOfLikes },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to like reply');
  }
};

const unlikeReply = async (userId, replyId) => {
  const { likes } = await Reply.findById(replyId);
  const newNumberOfLikes = likes - 1;
  return await Reply.findByIdAndUpdate(
    replyId,
    { likes: newNumberOfLikes },
    { new: true }
  );
};

module.exports = {
  createComment,
  likeComment,
  likeReply,
  unlikeComment,
  replyComment,
};
