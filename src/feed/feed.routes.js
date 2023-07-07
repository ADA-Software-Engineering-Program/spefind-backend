const { Router } = require('express');
const {
  createFeed,
  getFeeds,
  likeFeed,
  unlikeFeed,
  getFeed,
  editFeed,
  hideFeed,
  pinFeed,
  repostFeed,
  likeFeedRepost,
  getUserFeeds,
  deleteFeed,
  deleteAllFeeds,
} = require('./feed.controllers');
const { feedAuthorization } = require('../helpers/auth');
const router = Router();
const upload = require('../helpers/multer');

router.post('/create', upload.array('feed-photos', 10), createFeed);

router.put('/like', likeFeed);

router.put('/unlike', unlikeFeed);

router.get('/user/all', getUserFeeds);

// router.get('/all', getFeeds);

router.get('/:_id', getFeed);

router.patch('/:_feedPin', feedAuthorization, pinFeed);

router.put('/edit', feedAuthorization, editFeed);

router.patch('/:hide/:_feedId', hideFeed);

router.delete('/delete/:_id', deleteFeed);

router.post('/:_repostType', repostFeed);

router.post('/repost/like', likeFeedRepost);

router.delete('/all/delete', deleteAllFeeds);

// router.put('/edit');

module.exports = router;
