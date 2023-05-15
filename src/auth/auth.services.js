const User = require('./user.model');
const ApiError = require('../helpers/error');
const Following = require('../user/following.model');
const Follow = require('../user/follow.model');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');

const registerUser = async (data) => {
  const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
  data.userPin = code;
  const rawData = JSON.parse(JSON.stringify(data));
  const returnedData = await User.create(data);
  const user = { userId: returnedData._id };
  await Follow.create(user);
  await Following.create(user);
  const refreshCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
  // cron.schedule('*/5 * * * *', async () => {
  //   await User.findByIdAndUpdate(
  //     returnedData._id,
  //     { userPin: refreshCode },
  //     { new: true }
  //   );
  // });
  return returnedData;
};

const setProfile = async (userId, data) => {
  try {
    const rawData = data;
    let hashedPassword;

    if (data.password) hashedPassword = await bcrypt.hash(data.password, 10);
    rawData.password = hashedPassword;
    const { followings, ...refinedData } = data;

    await Following.findOneAndUpdate(
      { userId: userId },
      { following: followings },
      {
        new: true,
      }
    );

    const outputData = await User.findByIdAndUpdate(
      userId,
      { $set: refinedData },
      { new: true }
    );

    return outputData;
  } catch (error) {
    throw new ApiError(400, 'Unable to input user information');
  }
};

const confirmOTP = async (userId, data) => {
  try {
    const { userPin } = await User.findById(userId);
    if (userPin != data) {
      throw new ApiError(400, 'Incorrect pin inputted...');
    }
    return await User.findByIdAndUpdate(
      userId,
      { isAccountConfirmed: true },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Incorrect pin inputted...');
  }
};

const resendOTP = async (userId) => {
  const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
  const { userPin } = await User.findById(userId);
  cron.schedule('*/5 * * * *', async () => {
    await User.findByIdAndUpdate(userId, { userPin: code }, { new: true });
  });

  return userPin;
};

const updateUserById = async (id, data) => {
  try {
    return await User.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new ApiError(400, 'Unable to update user by Id');
  }
};

const userBio = async (userId, info) => {
  try {
    return await updateUserById(userId, info);
  } catch (error) {
    throw new ApiError(400, 'Unable to update User Bio...');
  }
};

const getUserByMail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, 'You are yet to be registered with this mail...');
    }

    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    throw new ApiError(
      400,
      'Oops! You are yet to be registered with this mail...'
    );
  }
};

const changePassword = async (user, data) => {
  let hashedPassword = await bcrypt.hash(data, 10);
  return await User.findOneAndUpdate(
    { email: user },
    { password: hashedPassword },
    { new: true }
  );
};

const comparePassword = async (entered, password) => {
  try {
    const result = await bcrypt.compare(entered, password);
    if (!result) {
      throw new ApiError(400, 'Oops! Inputted password is incorrect!');
    }
    return result;
  } catch (err) {
    throw new ApiError(400, 'Incorrect old password inputted...');
  }
};

const uploadPhoto = async (userId, data) => {
  try {
    return await updateUserById(userId, data);
  } catch (error) {
    throw new ApiError(400, 'Unable to upload photo');
  }
};

const editUserProfile = async (userId, data) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(400, 'User not found...');
  }
  if (data) {
    if (data.email) {
      const confirm = await User.findOne({ email: data.email });
      if (confirm) {
        throw new ApiError(
          400,
          'A user with this email exists on this platform'
        );
      }
    }

    return await User.findByIdAndUpdate(userId, data, { new: true });
  }
  throw new ApiError(400, "Kindly input the details you're looking to update!");
};

const updateField = async (userId, data) => {
  return await User.findOneAndUpdate({ _id: userId }, data, { new: true });
};

module.exports = {
  registerUser,
  updateField,
  setProfile,
  userBio,
  editUserProfile,
  confirmOTP,
  getUserByMail,
  updateField,
  resendOTP,
  uploadPhoto,
  changePassword,
};
