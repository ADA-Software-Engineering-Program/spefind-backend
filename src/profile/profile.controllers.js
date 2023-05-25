const catchAsync = require('express-async-handler');
const cloudinary = require('../helpers/cloudinary');
const profileService = require('./profile.service');
const ApiError = require('../helpers/error');

const editProfile = catchAsync(async (req, res) => {
  if (req.body.password) {
    throw new ApiError(400, "You can't update your password Here!");
  }
  const updatedbody = req.body;

  if (req.file) {
    const avatar = await cloudinary.uploader.upload(req.file.path);
    updatedbody.photo = avatar.secure_url;
  }
  const user = await profileService.createProfile(req.user._id, updatedbody);
  res.status(200).json({
    status: 'success',
    message: 'Yeaa! Profile update successful!',
    user,
  });
});

const createPastEvent = catchAsync(async (req, res) => {
  let requestBody = req.body;
  if (req.file) {
    const avatar = await cloudinary.uploader.upload(req.file.path);
    requestBody.eventPhoto = avatar.secure_url;
  }
  const data = await profileService.createEvent(req.user.id, requestBody);
  res
    .status(201)
    .json({ status: true, message: 'Past event successfully added...', data });
});

const getCurrentUser = catchAsync(async (req, res) => {
  let user;

  if (req.query.userId) {
    user = await profileService.getUserById(req.query.userId);
  } else {
    user = await profileService.getUserById(req.user._id);
  }

  res
    .status(200)
    .json({ status: true, message: 'User now retrieved... ', user });
});

const emailSubscribe = catchAsync(async (req, res) => {
  await profileService.emailSubscribe(req.body.email);

  res.status(201).json({
    status: 'success',
    message: 'Email successfully added to mailing list...',
  });
});

const allSubscribers = catchAsync(async (req, res) => {
  const data = await profileService.allSubscribers();
  res
    .status(200)
    .json({ status: true, message: 'All subscribers now fetched...', data });
});

module.exports = {
  editProfile,
  createPastEvent,
  getCurrentUser,
  emailSubscribe,
  allSubscribers,
};
