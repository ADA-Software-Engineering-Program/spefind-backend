const { Router } = require('express');
const {
  createFeed,
  getFeeds,
  likeFeed,
  unlikeFeed,
} = require('./feed.controllers');
const { userAuthentication } = require('../helpers/auth');
const router = Router();
const upload = require('../helpers/multer');

router.post('/create', upload.array('feed-photos', 10), createFeed);

router.put('/like', likeFeed);

router.put('/unlike', unlikeFeed);

router.get('/all', getFeeds);

module.exports = router;
