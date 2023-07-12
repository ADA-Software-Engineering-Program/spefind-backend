const Follower = require('./follow.model');
const Following = require('./following.model');
const User = require('../auth/user.model');
const ApiError = require('../helpers/errors');
const bcrypt = require('bcryptjs');

const follow = async (follower, followed) => {
  // try {

  // }catch(error) {
  //   throw new ApiError(400, 'Unable to follow user')
  // }
  const { following } = await Following.findOne({ userId: follower });

  for (let i = 0; i < following.length; i++) {
    if (followed == following[i]) {
      throw new ApiError(400, 'Ooops, You already follow this user!');
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

const requestCredentialResetCode = async (userId) => {
  const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
  await User.findByIdAndUpdate(userId, { userPin: code }, { new: true });
  return code;
};

const pinVerification = async (userId, inputtedPin) => {
  const { userPin } = await User.findById(userId);
  console.log(userPin);
  if (userPin !== inputtedPin) {
    throw new ApiError(400, 'Invalid pin inputted...');
  }
  return;
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
  try {
    return await User.find({ isProfileCreationComplete: true });
  } catch (error) {
    throw new ApiError(400, 'Unable to retrieve all users...');
  }
};

const updateEmail = async (userId, newEmail) => {
  try {
    await User.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
  } catch (error) {
    throw new ApiError(400, 'Unable to update email');
  }
};

const updatePassword = async (userId, newPassword) => {
  let hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to update password');
  }
};

const updateProfile = async (userId, data) => {
  if (data.username) {
    const checkUsername = await User.find({ username: data.username });
    if (checkUsername.length > 0) {
      throw new ApiError(400, 'Oops! This username has been taken...');
    } else {
      await User.findByIdAndUpdate(
        userId,
        { username: data.username },
        { new: true }
      );
    }
  }
  await User.findByIdAndUpdate(userId, data, { new: true });
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

module.exports = {
  follow,
  getUsers,
  requestCredentialResetCode,
  getUserById,
  unfollow,
  updateEmail,
  updatePassword,
  updateProfile,
  allFollowings,
  pinVerification,
};
