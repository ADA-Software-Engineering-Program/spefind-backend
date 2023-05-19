const Comment = require('./comment.model');
const ApiError = require('../helpers/error');
const Feed = require('../feed/feed.model');

const createComment = async (userId, data, feedId) => {
  try {
    let commentData = data;
    commentData.author = userId;
    commentData.feed = feedId;
    const comment = await Comment.create(commentData);
    return await Feed.findByIdAndUpdate(
      feedId,
      { $push: { comments: comment._id } },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to create comment...');
  }
};

module.exports = { createComment };
