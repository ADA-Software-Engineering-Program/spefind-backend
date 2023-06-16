const Comment = require('./comment.model');
const ApiError = require('../helpers/error');
const Feed = require('../feed/feed.model');
const Reply = require('./reply.model');
const CommentLike = require('./comment.like');

const createComment = async (userId, data, feedId) => {
  try {
    let commentData = data;
    commentData.author = userId;
    commentData.feed = feedId;
    const comment = await Comment.create(commentData);

    await Feed.findByIdAndUpdate(
      feedId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    const { numberOfComments } = await Feed.findById(feedId);

    const newNumberOfComments = numberOfComments + 1;

    return await Feed.findByIdAndUpdate(
      feedId,
      { numberOfComments: newNumberOfComments },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to create comment...');
  }
};

const getComments = async (feedId) => {
  try {
    return await Comment.find({ feed: feedId })
      .populate('author')
      .populate([
        {
          path: 'replies',
          model: 'Reply',

          populate: {
            path: 'author',
            model: 'User',
          },
        },
      ]);
  } catch (error) {
    throw new ApiError(400, 'Unable to get all comments...');
  }
};

const likeComment = async (userId, commentId) => {
  const checkComment = await Comment.findById(commentId);
  if (!checkComment) {
    throw new ApiError(400, ' Oops! This comment no longer exists!');
  }

  const createCommentLike = {
    likedBy: userId,
    commentary: commentId,
    isLiked: true,
  };
  await CommentLike.create(createCommentLike);

  const { commentLikes } = await Comment.findById(commentId);
  const newNumberOfLikes = commentLikes + 1;
  return await Comment.findByIdAndUpdate(
    commentId,
    { commentLikes: newNumberOfLikes },
    { new: true }
  );
};

const unlikeComment = async (commentId) => {
  try {
    const { likes } = await Comment.findById(commentId);
    const newNumberOfLikes = likes - 1;
    return await Comment.findByIdAndUpdate(
      commentId,
      { likes: newNumberOfLikes },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to like comment...');
  }
};

const replyComment = async (userId, commentId, reply) => {
  try {
    const replyData = {};
    replyData.author = userId;
    replyData.reply = reply;
    const replyResponse = await Reply.create(replyData);
    return await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: [replyResponse._id] } },
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
  getComments,
  likeReply,
  unlikeComment,
  replyComment,
};
