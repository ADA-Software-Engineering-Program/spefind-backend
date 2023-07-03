const feedService = require('./feed.service');
const cloudinary = require('../helpers/cloudinary');
const catchAsync = require('express-async-handler');
const ApiError = require('../helpers/errors');
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
  const data = await feedService.getFeeds();

  res
    .status(201)
    .json({ status: 'success', message: 'All feeds now retrieved...', data });
});

const getFeed = catchAsync(async (req, res) => {
  const data = await feedService.getFeed(req.params._id);
  res
    .status(200)
    .json({ status: true, message: 'Feed successfully retrieved...', data });
});

const likeFeed = catchAsync(async (req, res) => {
  await feedService.likeFeed(req.user._id, req.query.feedId);

  res.status(201).json({ status: true, message: 'You liked this feed...' });
});

const editRepost = catchAsync(async (req, res) => {
  const data = await feedService.editRepost(req.query.repostId, req.body);

  res.status(200).json({ status: 'success', message: '' });
});

const unlikeFeed = catchAsync(async (req, res) => {
  await feedService.unlikeFeed(req.user._id, req.query.feedId);

  res.status(201).json({ status: true, message: 'You unliked this feed...' });
});

const editFeed = catchAsync(async (req, res) => {
  const data = await feedService.editFeed(req.query.feedId, req.body);
  res
    .status(200)
    .json({ status: true, message: 'Feed Update Successful...', data });
});

const deleteFeed = catchAsync(async (req, res) => {
  await feedService.deleteFeed(req.params._id);

  res.status(200).json({
    status: true,
    message: `Feed ${req.params._id} successfully deleted...`,
  });
});

const repostFeed = catchAsync(async (req, res) => {
  let { _repostType } = req.params;
  let data;

  if (
    !_repostType &&
    _repostType != 'repost' &&
    _repostType != 'second_repost'
  ) {
    throw new ApiError(
      400,
      'Kindly indicate the sort of repost you are trying to make...'
    );
  } else {
    data = await feedService.repostFeed(
      req.user._id,
      req.params._repostType,
      req.query.feedId,
      req.body.content
    );
  }

  res.status(201).json({ status: 'success', message: 'Repost Successful!' });
});

const likeFeedRepost = catchAsync(async (req, res) => {
  await feedService.likeFeedRepost(req.user._id, req.query.repostId);

  res
    .status(201)
    .json({ status: true, message: 'You liked this feed repost...' });
});
module.exports = {
  createFeed,
  editFeed,
  editRepost,
  getFeed,
  getFeeds,
  likeFeed,
  likeFeedRepost,
  unlikeFeed,
  repostFeed,
  deleteFeed,
};
