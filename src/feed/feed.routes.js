const { Router } = require('express');
const { createFeed } = require('./feed.controllers');
const { userAuthentication } = require('../helpers/auth');
const router = Router();
const upload = require('../helpers/multer');

router.post(
  '/create',
  userAuthentication,
  upload.single('thumbNail'),
  createFeed
);

module.exports = router;
