const Feed = require('./feed.model');
const ApiError = require('../helpers/error');
const Following = require('../user/following.model');
const Comment = require('../comments/comment.model');
const User = require('../auth/user.model');
const moment = require('moment');

const createFeed = async (userId, data) => {
  try {
    const feed = data;
    feed.author = userId;
    const rawFeed = JSON.parse(JSON.stringify(feed));

    const rawData = (await Feed.create(rawFeed)).populate('author');

    const { numberOfPosts } = await User.findById(userId);

    const newNumberOfPosts = numberOfPosts + 1;

    await User.findByIdAndUpdate(
      userId,
      { numberOfPosts: newNumberOfPosts },
      { new: true }
    );

    return rawData;
  } catch (error) {
    throw new ApiError(400, 'Unable to create feed...');
  }
};

const getFeeds = async (userId) => {
  return await Feed.find({ isPublic: true })
    .sort({ _id: -1 })
    .populate('comments')
    .populate('author');
  // let feedList = [];
  // const { following } = await Following.findOne({ userId: userId });

  // const time = moment()
  //   .startOf('hour')
  //   .fromNow();
  // console.log(time);
  // for (let i = 0; i < following.length; i++) {
  //   // console.log(following[i]);
  //   const followerFeed = await Feed.find({ author: following[i] });
  //   console.log(followerFeed);
  // }
};

const likeFeed = async (feedId) => {
  try {
    const { likes } = await Feed.findById(feedId);
    const newNumberOfLikes = likes + 1;

    return await Feed.findByIdAndUpdate(
      feedId,
      { likes: newNumberOfLikes },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to like this feed...');
  }
};

const unlikeFeed = async (feedId) => {
  try {
    const { likes } = await Feed.findById(feedId);
    const newNumberOfLikes = likes - 1;

    return await Feed.findByIdAndUpdate(
      feedId,
      { likes: newNumberOfLikes },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to unlike this feed...');
  }
};

const getFeed = async (feedId) => {
  try {
    const { numberOfViews } = await Feed.findById(feedId);

    const newNumberOfViews = numberOfViews + 1;

    await Feed.findByIdAndUpdate(
      feedId,
      { numberOfViews: newNumberOfViews },
      { new: true }
    );

    return await Feed.findById(feedId)
      .populate('author')
      .populate([
        {
          path: 'author',
          model: 'User',
          populate: { path: 'discipline', model: 'Field' },
        },
      ])
      .populate([
        {
          path: 'comments',
          model: 'Comment',
          populate: { path: 'author', model: 'User' },
        },
      ])
      .populate([
        {
          path: 'comments',
          model: 'Comment',

          populate: {
            path: 'replies',
            model: 'Reply',
            populate: { path: 'replyBy', model: 'User' },
          },
        },
      ]);
  } catch (error) {
    throw new ApiError(400, 'Unable to retrieve feed...');
  }
};

const editFeed = async (feedId, feedData) => {
  try {
    return await Feed.findByIdAndUpdate(feedId, feedData, { new: true });
  } catch (error) {
    throw new ApiError(400, 'Unable to edit feed...');
  }
};

const deleteFeed = async (feedId) => {
  try {
    await Comment.deleteMany({ feed: feedId });
    return await Feed.findByIdAndDelete(feedId);
  } catch (error) {
    throw new ApiError(400, 'Unable to delete feed...');
  }
};

module.exports = {
  createFeed,
  editFeed,
  getFeed,
  getFeeds,
  likeFeed,
  unlikeFeed,
  deleteFeed,
};
