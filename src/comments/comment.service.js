const Comment = require('./comment.model');
const ApiError = require('../helpers/errors');
const Feed = require('../feed/feed.model');
const Reply = require('./reply.model');
const CommentLike = require('./comment.like');
const ReplyLike = require('./reply.like');

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

  const newCheckUserLike = checkUserLike.map((usermake) => usermake.commentary);

  if (newComments.length != newCheckUserLike.length) {
    for (let i = 0; i < newComments.length; i++) {
      const tellie = await CommentLike.findOne({
        likedBy: userId,
        commentary: newComments[i],
      });

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
  )
    .populate('commentary')
    .populate([
      {
        path: 'commentary',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User',
          select:
            'firstName lastName email username discipline areaOfSpecialty thumbNail',
        },
      },
    ])
    .populate([
      {
        path: 'commentary',
        model: 'Comment',
        populate: {
          path: 'feed',
          model: 'Feed',
          select: 'author content feedPhotos',
        },
      },
      {
        path: 'commentary',
        model: 'Comment',
        populate: {
          path: 'feed',
          model: 'Feed',
          select: 'author content feedPhotos',
          populate: {
            path: 'author',
            model: 'User',
            select:
              'firstName lastName username email thumbNail discipline areaOfSpecialty ',
          },
        },
      },
      // {
      //   path: 'commentary',
      //   model: 'Comment',
      //   populate: {
      //     path: 'replies',
      //     model: 'Reply',
      //     select: 'author reply replies replyLikes createdAt updatedAt',
      //     populate: {
      //       path: 'author',
      //       model: 'User',
      //       select:
      //         'firstName lastName username thumbNail discipline areaOfSpecialty',
      //     },
      //   },
      // },
    ]);
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
};

const getReplies = async (userId, commentId) => {
  try {
    console.log(commentId);
    const checkReplies = await Reply.find({ comment: commentId });
    // console.log(checkReplies);
    if (checkReplies.length === 0) {
      throw new ApiError(400, 'There are no comments for this feed yet...');
    }

    const replies = await Reply.find({ comment: commentId });
    const checkUserLike = await ReplyLike.find(
      {
        likedBy: userId,
        commentary: commentId,
      },
      { commentary: 0 }
    );

    const { feed } = await Comment.findById(commentId);

    const newReplies = replies.map((reply) => reply._id);

    const newCheckUserLike = checkUserLike.map((usermake) => usermake.reply);
    if (newReplies.length != newCheckUserLike.length) {
      for (let i = 0; i < newReplies.length; i++) {
        const tellie = await ReplyLike.findOne({
          likedBy: userId,
          commentary: newReplies[i],
        });

        if (!tellie) {
          await ReplyLike.create({
            likedBy: userId,
            reply: newReplies[i],
            feed: feed,
          });
        }
      }
    }
    const allReplyLikes = await ReplyLike.find(
      { comment: commentId },
      { reply: 1, isLiked: 1 }
    )
      .populate('reply', { feed: 0 })
      .populate([
        {
          path: 'reply',
          model: 'Reply',
          select: 'author reply replyLikes createdAt updatedAt',
          populate: {
            path: 'author',
            model: 'User',
            select:
              'firstName lastName email username thumbNail discipline areaOfSpecialty',
          },
        },
      ]);
    return allReplyLikes;
  } catch (error) {
    throw new ApiError(400, 'Unable to get replies...');
  }
};

const likeComment = async (userId, commentId) => {
  const checkComment = await Comment.findById(commentId);
  if (!checkComment) {
    throw new ApiError(400, ' Oops! This comment no longer exists!');
  }

  await CommentLike.findOneAndUpdate(
    {
      likedBy: userId,
      commentary: commentId,
    },
    { isLiked: true },
    { new: true }
  );

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
      throw new ApiError(400, 'Oops! This comment no longer exists!');
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
    const { feed } = await Comment.findById(commentId);
    const replyData = {};
    replyData.author = userId;
    replyData.reply = reply;
    replyData.comment = commentId;
    replyData.feed = feed;

    const replyResponse = await Reply.create(replyData);

    const replyLikeData = {
      likedBy: userId,
      reply: replyResponse._id,
      commentary: commentId,
      feed: feed,
    };
    const createReplyLike = await ReplyLike.create(replyLikeData);

    return await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: [createReplyLike._id] } },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to reply comment...');
  }
};

const likeReply = async (userId, replyId) => {
  try {
    const { likes } = await Reply.findById(replyId);
    const newNumberOfLikes = likes + 1;

    await ReplyLike.findOneAndUpdate(
      { likedBy: userId, reply: replyId },
      { isLiked: true },
      { new: true }
    );
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
  try {
    const { likes } = await Reply.findById(replyId);
    const newNumberOfLikes = likes - 1;

    await ReplyLike.findOneAndUpdate(
      { likedBy: userId, reply: replyId },
      { isLiked: false },
      { new: true }
    );

    return await Reply.findByIdAndUpdate(
      replyId,
      { likes: newNumberOfLikes },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to like reply...');
  }
};

const deleteComment = async (commentId) => {
  const data = await Reply.deleteMany({ comment: commentId });

  await CommentLike.deleteMany({ commentary: commentId });
  return Comment.findByIdAndDelete(commentId);
};

const deleteReply = async (replyId) => {
  try {
    return await Reply.findByIdAndDelete(replyId);
  } catch (error) {
    throw new ApiError(400, 'Unable to delete reply...');
  }
};

module.exports = {
  createComment,
  likeComment,
  deleteReply,
  deleteComment,
  getReplies,
  getComments,
  likeReply,
  unlikeReply,
  unlikeComment,
  replyComment,
};
