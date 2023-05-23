const Follower = require('./follow.model');
const Following = require('./following.model');
const User = require('../auth/user.model');
const ApiError = require('../helpers/error');

const follow = async (follower, followed) => {
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
  const { following } = await Following.findOne({ userId: follower });
  for (let i = 0; i < following.length; i++) {
    if (followed != following[i]) {
      throw new ApiError(400, 'Ooops, You already follower this user!');
    }
  }
  try {
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
    throw new ApiError(400, 'Unable to unfollow this user');
  }
};

const getUsers = async () => {
  return await User.find();
};

module.exports = { follow, getUsers, getUserById, unfollow };
