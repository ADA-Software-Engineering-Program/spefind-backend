const userService = require('./user.service');
const catchAsync = require('express-async-handler');
const { editProfileMail } = require('../helpers/email');

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

const requestCredentialReset = catchAsync(async (req, res) => {
  let passcode = await userService.requestCredentialResetCode(req.user._id);
  let firstLetter = req.params.credential[0].toUpperCase();
  let otherLetters = req.params.credential.slice(1);
  let credentialTransform = `${firstLetter}${otherLetters}`;
  editProfileMail(
    req.user.email,
    `You're receiving this mail because you requested to change your ${req.params.credential} on the Corddit app. Your six-digit pin is ${passcode}. Kindly ignore if you did not request to make this change.`,
    credentialTransform
  );

  res.status(200).json({
    status: true,
    message: `We sent a verification code to ${req.user.email}... Do confirm!`,
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

const getAllUsers = catchAsync(async (req, res) => {
  const data = await userService.getUsers();

  res
    .status(201)
    .json({ status: true, message: 'All users retrieved...', data });
});

const getFollowers = catchAsync(async (req, res) => {
  const data = await userService.allFollowings(req.user._id);

  res.status(201).json({
    status: 'success',
    message: 'all followers/followings retrieved...',
    data,
  });
});

module.exports = {
  follow,
  getAllUsers,
  getCurrentUser,
  requestCredentialReset,
  getFollowers,
  unfollow,
  getFollowers,
};
