const catchAsync = require('express-async-handler');
const cloudinary = require('../helpers/cloudinary');
const profileService = require('./profile.service');

const editProfile = catchAsync(async (req, res) => {
  if (req.body.password) {
    throw new ApiError(400, "You can't update your password Here!");
  }
  const updatedbody = req.body;
  console.log(req.user);

  if (req.file) {
    const avatar = await cloudinary.uploader.upload(req.file.path);
    updatedbody.photo = avatar.secure_url;
  }

  const user = await profileService.createProfile(req.user.id, updatedbody);
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

module.exports = { editProfile, createPastEvent };
