const feedService = require('./feed.service');
const cloudinary = require('../helpers/cloudinary');
const catchAsync = require('express-async-handler');

const createFeed = catchAsync(async (req, res) => {
  const requestBody = req.body;
  if (req.file) {
    const avatar = await cloudinary.uploader.upload(req.file.path);
    requestBody.thumbNail = avatar.secure_url;
  }
  const data = await feedService.createFeed(req.user._id, requestBody);
  res
    .status(200)
    .json({ status: 'success', message: 'Post successfully made...', data });
});

module.exports = { createFeed };
