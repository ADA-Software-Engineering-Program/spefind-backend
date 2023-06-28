const { Router } = require('express');
const {
  editProfile,
  getCurrentUser,
  createPastEvent,
  editEvent,
  deleteEvent,
  addCoverBanner,
  getEvent,
} = require('./profile.controllers');
const upload = require('../helpers/multer');
const router = Router();

router.get('/user', getCurrentUser);

router.get('/event/:_eventId', getEvent);

router.put('/setup', upload.single('photo'), editProfile);

router.put('/cover/banner', upload.single('banner-cover'), addCoverBanner);

router.patch('/event/edit/:_eventId', upload.single('eventPhoto'), editEvent);

router.post('/event/add', upload.single('eventPhoto'), createPastEvent);

router.delete('/event/delete', deleteEvent);

module.exports = router;
