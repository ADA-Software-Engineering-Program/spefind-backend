const User = require('../auth/user.model');

const getStats = async () => {
  const data_1 = await User.aggregate([
    { $match: {} },
    { $count: 'all_users' },
  ]);

  const data_2 = await User.aggregate([
    { $match: { isProfileCreated: true } },
    { $count: 'all_profile_created_users' },
  ]);

  const data_3 = await User.aggregate([
    { $match: { isVisible: 'true' } },
    { $count: 'all_profile_live_users' },
  ]);

  return [...data_1, data_2, data_3];
};

module.exports = { getStats };
