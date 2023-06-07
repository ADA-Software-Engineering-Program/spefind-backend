const { Router } = require('express');
const {
  editProfile,
  getCurrentUser,
  createPastEvent,
  addCoverBanner,
} = require('./profile.controllers');
const upload = require('../helpers/multer');
const router = Router();

router.get('/user', getCurrentUser);

router.put('/setup', upload.single('photo'), editProfile);

router.put('/cover/banner', upload.single('banner-cover'), addCoverBanner);

router.post('/event/add', upload.single('eventPhoto'), createPastEvent);

module.exports = router;
