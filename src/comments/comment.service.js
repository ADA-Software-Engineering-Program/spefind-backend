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

const getComments = async (userId, feedId) => {
  try {
    // console.log(userId, feedId);
    const checkComments = await Comment.find({ feed: feedId });
    if (checkComments.length === 0) {
      throw new ApiError(400, 'There are no comments for this feed yet...');
    }

    const comments = await Comment.find({ feed: feedId });
    const checkUserLike = await CommentLike.find({
      likedBy: userId,
      feed: feedId,
    });

    const newComments = comments.map((comment) => comment._id);

    const newCheckUserLike = checkUserLike.map(
      (usermake) => usermake.commentary
    );

    if (newComments.length != newCheckUserLike.length) {
      console.log(true);
      for (let i = 0; i < newComments.length; i++) {
        const tellie = await CommentLike.findOne({
          likedBy: userId,
          commentary: newComments[i],
        });
        // console.log(tellie);
        if (!tellie) {
          await CommentLike.create({
            likedBy: userId,
            commentary: newComments[i],
            feed: feedId,
          });
        }
      }
    }
    const allCommentLikes = await CommentLike.find(
      { feed: feedId },
      { likedBy: 0, feed: 0 }
    ).populate('commentary');
    return allCommentLikes;
    // return allCommentLikes;
    // .populate('author')
    // .populate([
    //   {
    //     path: 'replies',
    //     model: 'Reply',

    //     populate: {
    //       path: 'author',
    //       model: 'User',
    //     },
    //   },
    // ]);
  } catch (error) {
    throw new ApiError(400, 'Unable to get all comments...');
  }
};

const likeComment = async (userId, commentId) => {
  console.log(userId, commentId);
  const checkComment = await Comment.findById(commentId);
  if (!checkComment) {
    throw new ApiError(400, ' Oops! This comment no longer exists!');
  }

  const tell = await CommentLike.findOneAndUpdate(
    {
      likedBy: userId,
      commentary: commentId,
    },
    { isLiked: true },
    { new: true }
  );
  console.log(tell);

  const { commentLikes } = await Comment.findById(commentId);
  const newNumberOfLikes = commentLikes + 1;
  return await Comment.findByIdAndUpdate(
    commentId,
    { commentLikes: newNumberOfLikes },
    { new: true }
  );
};

const unlikeComment = async (userId, commentId) => {
  try {
    const checkComment = await Comment.findById(commentId);
    if (!checkComment) {
      throw new ApiError(400, ' Oops! This comment no longer exists!');
    }

    await CommentLike.findOneAndUpdate(
      { likedBy: userId, commentary: commentId },
      { isLiked: false },
      { new: true }
    );

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
