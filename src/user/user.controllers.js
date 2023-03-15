const userService = require('./user.service');
const catchAsync = require('express-async-handler');

const follow = catchAsync(async (req, res) => {
  await userService.follow(req.user._id, req.query.userId);

  res.status(200).json({
    status: 'success',
    message: `You are now a follower of the user ${req.query.userId}`,
  });
});

const unfollow = catchAsync(async (req, res) => {
  const data = await userService.unfollow(req.user._id, req.query.userId);
  res.status(201).json({
    status: 'success',
    message: `You have successfully unfollowed the user ${req.query.userId}`,
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  let user;

  if (req.query.userId) {
    user = await userService.getUserById(req.query.userId);
  } else {
    user = await userService.getUserById(req.user._id);
  }

  res
    .status(200)
    .json({ status: true, message: 'User now retrieved... ', user });
});

module.exports = { follow, getCurrentUser, unfollow };
