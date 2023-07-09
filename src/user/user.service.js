const Follower = require('./follow.model');
const Following = require('./following.model');
const User = require('../auth/user.model');
const ApiError = require('../helpers/errors');

const follow = async (follower, followed) => {
  // try {

  // }catch(error) {
  //   throw new ApiError(400, 'Unable to follow user')
  // }
  const { following } = await Following.findOne({ userId: follower });

  for (let i = 0; i < following.length; i++) {
    if (followed == following[i]) {
      throw new ApiError(400, 'Ooops, You already follower this user!');
    }
  }
  const data = await Following.findOneAndUpdate(
    { userId: follower },
    { $push: { following: followed } },
    { new: true }
  );
  return await Follower.findOneAndUpdate(
    { userId: followed },
    { $push: { followers: follower } },
    { new: true }
  );
};

const getUserById = async (id) => {
  try {
    return await User.findById(id).populate('discipline');
  } catch (error) {
    throw new ApiError(400, 'Unable to get user');
  }
};

const unfollow = async (follower, followed) => {
  try {
    const { following } = await Following.findOne({ userId: follower });
    for (let i = 0; i < following.length; i++) {
      if (followed != following[i]) {
        throw new ApiError(400, 'Ooops, You already follow this user!');
      }
    }

    const data = await Following.findOneAndUpdate(
      { userId: follower },
      { $pull: { following: followed } },
      { new: true }
    );
    return await Follower.findOneAndUpdate(
      { userId: followed },
      { $pull: { followers: follower } },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to unfollow user');
  }
};

const getUsers = async () => {
  return await User.find({ isProfileCreationComplete: true });
};

const allFollowings = async (userId) => {
  const followers = await Follower.findOne({ userId: userId }).select(
    '-userId'
  );

  const followings = await Following.findOne({ userId: userId }).select(
    '-userId'
  );

  return [followers, followings];
};

module.exports = { follow, getUsers, getUserById, unfollow, allFollowings };
