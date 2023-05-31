const { Router } = require('express');
const {
  createFeed,
  getFeeds,
  likeFeed,
  unlikeFeed,
  getFeed,
  editFeed,
  repostFeed,
  likeFeedRepost,
  deleteFeed,
} = require('./feed.controllers');
const { feedAuthorization } = require('../helpers/auth');
const router = Router();
const upload = require('../helpers/multer');

router.post('/create', upload.array('feed-photos', 10), createFeed);

router.put('/like', likeFeed);

router.put('/unlike', unlikeFeed);

router.get('/all', getFeeds);

router.get('/:_id', getFeed);

router.put('/edit', feedAuthorization, editFeed);

router.delete('/delete/_:id', feedAuthorization, deleteFeed);

router.post('/repost', repostFeed);

router.post('/repost/like', likeFeedRepost);

module.exports = router;
