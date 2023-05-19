const feedService = require('./feed.service');
const cloudinary = require('../helpers/cloudinary');
const catchAsync = require('express-async-handler');
const fs = require('fs');
const { cloudinaryImageUploadMethod } = require('../helpers/image_upload');

const createFeed = catchAsync(async (req, res) => {
  const requestBody = req.body;

  const imageUrlList = [];

  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      const uploadedUrls = await cloudinaryImageUploadMethod(req.files[i].path);
      imageUrlList.push(uploadedUrls);
    }
    requestBody.feedPhotos = imageUrlList;
  }
  const data = await feedService.createFeed(req.user._id, requestBody);
  res
    .status(201)
    .json({ status: 'success', message: 'Post successfully made...', data });
});

const getFeeds = catchAsync(async (req, res) => {
  await feedService.getFeeds(req.user._id);
});

const likeFeed = catchAsync(async (req, res) => {
  await feedService.likeFeed(req.query.feedId);

  res.status(201).json({ status: true, message: 'You liked this feed...' });
});

const unlikeFeed = catchAsync(async (req, res) => {
  await feedService.unlikeFeed(req.query.feedId);

  res.status(201).json({ status: true, message: 'You unliked this feed...' });
});

module.exports = { createFeed, getFeeds, likeFeed, unlikeFeed };
