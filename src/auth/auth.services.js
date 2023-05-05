const User = require('./user.model');

const createProfile = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data, { new: true });
};

module.exports = { createProfile };
