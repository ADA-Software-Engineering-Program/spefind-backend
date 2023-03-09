const User = require('./user.model');
const ApiError = require('../helpers/error');
const bcrypt = require('bcryptjs');

const registerUser = (data) => {};

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

const confirmOTP = (userPin, data) => {
  if (userPin != data) {
    throw new ApiError(400, 'Incorrect pin inputted...');
  }
  return;
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

const editUserProfile = async (userId, data) => {
  console.log(data);
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
  editUserProfile,
  confirmOTP,
  getUserByMail,
  confirmOTP,
  changePassword,
  updatePassword,
};
