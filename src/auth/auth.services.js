const User = require('./user.model');
const ApiError = require('../helpers/error');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');

const registerUser = async (data) => {
  const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
  data.userPin = code;
  const rawData = JSON.parse(JSON.stringify(data));
  const returnedData = await User.create(rawData);
  const refreshCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
  cron.schedule('*/5 * * * *', async () => {
    await User.findByIdAndUpdate(
      returnedData._id,
      { userPin: refreshCode },
      { new: true }
    );
  });

  return returnedData;
};

const nameInput = async (userId, data) => {
  try {
    return await User.findByIdAndUpdate(userId, data, { new: true });
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

const inputPassword = async (userId, data) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to input Password...');
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

const updatePassword = async (email, oldPassword, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password...');
  }
  const compare = await comparePassword(oldPassword, user.password);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return await User.findOneAndUpdate(
    user._id,
    { password: hashedPassword },
    { new: true }
  );
};

const uploadPhoto = async (userId, data) => {
  try {
    return await User.findByIdAndUpdate(userId, data, { new: true });
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

module.exports = {
  registerUser,
  nameInput,
  inputPassword,
  editUserProfile,
  confirmOTP,
  getUserByMail,
  resendOTP,
  uploadPhoto,
  changePassword,
  updatePassword,
};
