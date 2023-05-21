const { Router } = require('express');
const {
  editProfile,
  getCurrentUser,
  createPastEvent,
} = require('./profile.controllers');
const upload = require('../helpers/multer');
const router = Router();

router.get('/user', getCurrentUser);

router.put('/setup', upload.single('photo'), editProfile);

router.post('/event/add', upload.single('eventPhoto'), createPastEvent);

module.exports = router;
