const Feed = require('./feed.model');
const ApiError = require('../helpers/error');
const Following = require('../user/following.model');
const Comment = require('../comments/comment.model');
const User = require('../auth/user.model');
const Repost = require('./repost.model');
const Reply = require('../comments/reply.model');
const moment = require('moment');
const CommentLike = require('../comments/comment.like');

const createFeed = async (userId, data) => {
  try {
    const feed = data;
    feed.author = userId;
    feed.feedType = 'original';
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

const getFeeds = async () => {
  // const repostData = await Repost.find({ repostAuthor: userId })
  //   .sort({ createdAt: -1 })
  //   .populate('repostAuthor')
  //   .populate('feed');
  const returnedData = await Feed.find()
    .sort({ createdAt: -1 })
    .populate('author', {
      email: 1,
      thumbNail: 1,
      firstName: 1,
      lastName: 1,
      areaOfSpecialty: 1,
      discipline: 1,
    })

    .populate([
      {
        path: 'feed',
        model: 'Feed',
        populate: {
          path: 'author',
          model: 'User',
          select:
            'firstName lastName username thumbNail discipline areaOfSpecialty',
        },
      },
    ])
    .populate([
      {
        path: 'feed',
        model: 'Feed',
        populate: {
          path: 'feed',
          model: 'Feed',
          populate: {
            path: 'author',
            model: 'User',
            select:
              'firstName lastName username thumbNail discipline areaOfSpecialty',
          },
        },
      },
    ]);

  return returnedData;
};

const likeFeed = async (userId, feedId) => {
  const { feedLikes } = await Feed.findById(feedId);
  const newNumberOfLikes = feedLikes + 1;

  const { likedBy } = await Feed.findById(feedId);

  for (let i = 0; i <= likedBy.length; i++) {
    if (userId == likedBy[i]) {
      throw new ApiError(400, 'Oops! You already liked this feed...');
    }
  }
  await Feed.findByIdAndUpdate(
    feedId,
    { $push: { likedBy: [userId] } },
    { new: true }
  );

  return await Feed.findByIdAndUpdate(
    feedId,
    { feedLikes: newNumberOfLikes },
    { new: true }
  );
};

const editRepost = async (repostId, content) => {
  await Repost.findByIdAndUpdate(
    repostId,
    { repostContent: content },
    { new: true }
  );
};

const unlikeFeed = async (userId, feedId) => {
  try {
    const { feedLikes } = await Feed.findById(feedId);
    const newNumberOfLikes = feedLikes - 1;

    await Feed.findByIdAndUpdate(
      feedId,
      { $pull: { likedBy: userId } },
      { new: true }
    );

    return await Feed.findByIdAndUpdate(
      feedId,
      { feedLikes: newNumberOfLikes },
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
          populate: [{ path: 'author', model: 'User' }],
        },
      ])
      .populate([
        {
          path: 'comments',
          model: 'Comment',

          populate: {
            path: 'replies',
            model: 'Reply',
            populate: [{ path: 'author', model: 'User' }],
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
    await CommentLike.deleteMany({ feed: feedId });
    await Reply.deleteMany({ feed: feedId });
    return await Feed.findByIdAndDelete(feedId);
  } catch (error) {
    throw new ApiError(400, 'Unable to delete feed...');
  }
};

const repostFeed = async (userId, feedType, feedId, commentary) => {
  try {
    let rawData = {};
    rawData.author = userId;
    rawData.content = commentary;
    rawData.feed = feedId;
    rawData.feedType = feedType;

    const data = await Feed.create(rawData);

    const { numberOfReposts } = await Feed.findById(feedId);

    const newNumberOfReposts = numberOfReposts + 1;

    await Feed.findByIdAndUpdate(
      feedId,
      { numberOfReposts: newNumberOfReposts },
      { new: true }
    );

    return await Feed.findById(data._id).populate('author');
    // .populate('feed')
    // .populate([
    //   {
    //     path: 'feed',
    //     model: 'Feed',
    //     populate: { path: 'author', model: 'User' },
    //   },
    // ]);
  } catch (error) {
    throw new ApiError(400, 'Unable to repost feed...');
  }
};
const likeFeedRepost = async (userId, feedId) => {
  try {
    const { repostLikes } = await Feed.findById(feedId);
    const newNumberOfLikes = repostLikes + 1;

    await Repost.findOneAndUpdate(
      { feed: feedId },
      { $push: { likedBy: [userId] } },
      { new: true }
    );

    return await Feed.findByIdAndUpdate(
      feedId,
      { repostLikes: newNumberOfLikes },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to like reposted feed...');
  }
};

module.exports = {
  createFeed,
  editFeed,
  getFeed,
  getFeeds,
  likeFeed,
  editRepost,
  likeFeedRepost,
  unlikeFeed,
  deleteFeed,
  repostFeed,
};
