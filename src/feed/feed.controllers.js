const feedService = require('./feed.service');
const cloudinary = require('../helpers/cloudinary');
const catchAsync = require('express-async-handler');
const fs = require('fs');
const { cloudinaryImageUploadMethod } = require('../helpers/image_upload');

const createFeed = async (req, res) => {
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
};

const getFeeds = catchAsync(async (req, res) => {
  const data = await feedService.getFeeds(req.user._id);

  res
    .status(201)
    .json({ status: 'success', message: 'All feeds now retrieved...', data });
});

const getFeed = async (req, res) => {
  const data = await feedService.getFeed(req.params._id);
  res
    .status(200)
    .json({ status: true, message: 'Feed successfully retrieved...', data });
};

const likeFeed = catchAsync(async (req, res) => {
  await feedService.likeFeed(req.query.feedId);

  res.status(201).json({ status: true, message: 'You liked this feed...' });
});

const unlikeFeed = catchAsync(async (req, res) => {
  await feedService.unlikeFeed(req.query.feedId);

  res.status(201).json({ status: true, message: 'You unliked this feed...' });
});

const editFeed = catchAsync(async (req, res) => {
  const data = await feedService.editFeed(req.query.feedId, req.body);
  res
    .status(200)
    .json({ status: true, message: 'Feed Update Successful...', data });
});

const deleteFeed = async (req, res) => {
  await feedService.deleteFeed(req.params._id);

  res.status(200).json({
    status: true,
    message: `Feed ${req.params._id} successfully deleted...`,
  });
};

module.exports = {
  createFeed,
  editFeed,
  getFeed,
  getFeeds,
  likeFeed,
  unlikeFeed,
  deleteFeed,
};
