const Feed = require('./feed.model');
const ApiError = require('../helpers/error');
const Following = require('../user/following.model');
const moment = require('moment');

const createFeed = async (userId, data) => {
  try {
    const feed = data;
    feed.author = userId;
    const rawFeed = JSON.parse(JSON.stringify(feed));
    return (await Feed.create(rawFeed)).populate('author');
  } catch (error) {
    throw new ApiError(400, 'Unable to create feed...');
  }
};

const getFeeds = async (userId) => {
  // const data = await Feed.find({ isPublic: true }).sort({ _id: -1 });
  let feedList = [];
  const { following } = await Following.findOne({ userId: userId });

  const time = moment()
    .startOf('hour')
    .fromNow();
  console.log(time);
  for (let i = 0; i < following.length; i++) {
    // console.log(following[i]);
    const followerFeed = await Feed.find({ author: following[i] });
    console.log(followerFeed);
  }
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

module.exports = { createFeed, getFeeds, likeFeed, unlikeFeed };
