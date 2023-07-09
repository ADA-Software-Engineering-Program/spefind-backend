const Feed = require('./feed.model');
const ApiErrors = require('../helpers/errors');
const Following = require('../user/following.model');
const Comment = require('../comments/comment.model');
const User = require('../auth/user.model');
const Repost = require('./repost.model');
const Reply = require('../comments/reply.model');
const moment = require('moment');
const CommentLike = require('../comments/comment.like');
const ReplyLike = require('../comments/reply.like');
const { customizedFeed, userBlock } = require('./customized.feed');

const createFeed = async (userId, data) => {
  try {
    const feed = data;
    feed.author = userId;
    feed.feedType = 'original';
    const rawFeed = JSON.parse(JSON.stringify(feed));

    const rawData = (await Feed.create(rawFeed)).populate('author', {
      email: 1,
      thumbNail: 1,
      firstName: 1,
      lastName: 1,
      username: 1,
      areaOfSpecialty: 1,
      discipline: 1,
    });

    const { numberOfPosts } = await User.findById(userId);

    const newNumberOfPosts = numberOfPosts + 1;

    await User.findByIdAndUpdate(
      userId,
      { numberOfPosts: newNumberOfPosts },
      { new: true }
    );

    return rawData;
  } catch (error) {
    throw new ApiErrors(400, 'Unable to create feed...');
  }
};

const getUserFeeds = async (userId) => {
  const getAllFeeds = await Feed.find();
  let feedInfo = getAllFeeds.map((feed) => {
    return { feedId: feed._id, feedAuthor: feed.author[0] };
  });

  for (let i = 0; i < feedInfo.length; i++) {
    const checkFeed = await customizedFeed.find({
      userId: userId,
      feed: feedInfo[i].feedId,
    });
    if (checkFeed.length === 0) {
      const { blockedContacts } = await userBlock.findOne({ userId: userId });

      for (let i = 0; i < blockedContacts.length; i++) {
        if (blockedContacts[i] === feedAuthor[i].feedId) {
          await customizedFeed.create({
            userId: userId,
            feed: feedInfo[i].feedId,
            feedAuthor: feedInfo[i].feedAuthor,
            isBlocked: true,
          });
        }
        await customizedFeed.create({
          userId: userId,
          feed: feedInfo[i].feedId,
          feedAuthor: feedInfo[i].feedAuthor,
        });
      }
    }
  }
  return await customizedFeed
    .find(
      { userId: userId, isHidden: false, isBlocked: false },
      { userId: 0, feedAuthor: 0, isBlocked: 0 }
    )
    .populate('feed')
    .populate([
      {
        path: 'feed',
        model: 'Feed',
        populate: {
          path: 'author',
          model: 'User',
          select:
            'firstName lastName email username thumbNail discipline areaOfSpecialty ',
        },
      },
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
              'firstName lastName username email thumbNail discipline areaOfSpecialty ',
          },
          populate: {
            path: 'feed',
            model: 'Feed',
          },
        },
      },
    ]);
};

const unblockUser = async (userId, userToUnblock) => {
  try {
    const checkBlockedContact = await userBlock.find({
      blockedContacts: { $in: userToUnblock },
      userId: { $in: userId },
    });
    if (checkBlockedContact.length === 0) {
      throw new ApiErrors(400, 'Oops! This user never got blocked...');
    }
    await userBlock.findOneAndUpdate(
      { userId: userId },
      { $pull: { blockedContacts: userToUnblock } },
      { new: true }
    );
    await customizedFeed.updateMany(
      { userId: userId, feedAuthor: userToUnblock },
      { $set: { isBlocked: false } }
    );
  } catch (error) {
    throw new ApiErrors(400, 'Oops! This user probably never got blocked...');
  }
};

const blockUser = async (userId, userToBlock) => {
  const checkUserBlockList = await userBlock.findOne({ userId: userId });
  if (!checkUserBlockList) {
    const talk = await userBlock.create({
      userId: userId,
      blockedContacts: [userToBlock],
    });
  }
  const checkBlockedContact = await userBlock.find({
    blockedContacts: { $in: userToBlock },
    userId: { $in: userId },
  });

  if (checkBlockedContact.length > 0) {
    throw new ApiErrors(400, 'Oops! You already blocked this user...');
  }

  await userBlock.findOneAndUpdate(
    { userId: userId },
    { $push: { blockedContacts: [userToBlock] } },
    { new: true }
  );
  await customizedFeed.updateMany(
    { userId: userId, feedAuthor: userToBlock },
    { $set: { isBlocked: true } }
  );
};

const getFeeds = async () => {
  const returnedData = await Feed.find()
    .sort({ createdAt: -1 })
    .populate('author', {
      email: 1,
      thumbNail: 1,
      firstName: 1,
      username: 1,
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
            'firstName lastName username email thumbNail discipline areaOfSpecialty',
        },
      },
    ]);
  // .populate([
  //   {
  //     path: 'feed',
  //     model: 'Feed',
  //     populate: {
  //       path: 'feed',
  //       model: 'Feed',
  //       populate: {
  //         path: 'author',
  //         model: 'User',
  //         select:
  //           'firstName lastName username thumbNail discipline areaOfSpecialty',
  //       },
  //     },
  //   },
  // ]);

  return returnedData;
};

const likeFeed = async (userId, feedId) => {
  const { feedLikes } = await Feed.findById(feedId);
  const newNumberOfLikes = feedLikes + 1;

  const { likedBy } = await Feed.findById(feedId);

  for (let i = 0; i <= likedBy.length; i++) {
    if (userId == likedBy[i]) {
      throw new ApiErrorss(400, 'Oops! You already liked this feed...');
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
    throw new ApiErrors(400, 'Unable to unlike this feed...');
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
    throw new ApiErrors(400, 'Unable to retrieve feed...');
  }
};

const pinFeed = async (feedId) => {
  try {
    return await Feed.findByIdAndUpdate(
      feedId,
      { isPinned: true },
      { new: true }
    );
  } catch (error) {
    throw new ApiErrors(400, 'Unable to pin feed...');
  }
};

const unPinFeed = async (feedId) => {
  try {
    return await Feed.findByIdAndUpdate(
      feedId,
      { isPinned: false },
      { new: true }
    );
  } catch (error) {
    throw new ApiErrors(400, 'Unable to unpin feed...');
  }
};

const hideFeed = async (userId, feedId) => {
  try {
    return await customizedFeed.findOneAndUpdate(
      { userId: userId, feed: feedId },
      { isHidden: true },
      { new: true }
    );
  } catch (error) {
    throw new ApiErrors(400, 'Unable to hide feed...');
  }
};

const unHideFeed = async (userId, feedId) => {
  try {
    return await customizedFeed.findOneAndUpdate(
      { userId: userId, feed: feedId },
      { isHidden: false },
      { new: true }
    );
  } catch (error) {
    throw new ApiErrors(400, 'Unable to unhide feed...');
  }
};

const editFeed = async (feedId, feedData) => {
  try {
    return await Feed.findByIdAndUpdate(feedId, feedData, { new: true });
  } catch (error) {
    throw new ApiErrors(400, 'Unable to edit feed...');
  }
};

const deleteFeed = async (feedId) => {
  try {
    await Comment.deleteMany({ feed: feedId });

    await CommentLike.deleteMany({ feed: feedId });

    await Reply.deleteMany({ feed: feedId });

    await customizedFeed.deleteMany({ feed: feedId });

    return await Feed.findByIdAndDelete(feedId);
  } catch (error) {
    throw new ApiErrors(400, 'Unable to delete feed...');
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

    return await Feed.findById(data._id)
      .populate('author', {
        email: 1,
        username: 1,
        thumbNail: 1,
        firstName: 1,
        lastName: 1,
        areaOfSpecialty: 1,
        discipline: 1,
      })
      .populate('feed', { author: 1, content: 1, feedPhotos: 1 })
      .populate([
        {
          path: 'feed',
          model: 'Feed',
          select: 'author content feedPhotos',
          populate: {
            path: 'author',
            model: 'User',
            select:
              'firstName lastName email username thumbNail discipline areaOfSpecialty ',
          },
        },
      ]);
  } catch (error) {
    throw new ApiErrors(400, 'Unable to repost feed...');
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
    throw new ApiErrors(400, 'Unable to like reposted feed...');
  }
};

const deleteAllFeeds = async () => {
  try {
    await customizedFeed.deleteMany();

    await CommentLike.deleteMany();

    await ReplyLike.deleteMany();

    await await Reply.deleteMany();

    await Comment.deleteMany();

    return await Feed.deleteMany();
  } catch (error) {
    throw new ApiErrors(400, 'Unable to delete all fields...');
  }
};

module.exports = {
  blockUser,
  unblockUser,
  createFeed,
  editFeed,
  getFeed,
  getFeeds,
  likeFeed,
  editRepost,
  likeFeedRepost,
  hideFeed,
  unHideFeed,
  unlikeFeed,
  pinFeed,
  unPinFeed,
  deleteFeed,
  getUserFeeds,
  deleteAllFeeds,
  repostFeed,
};
