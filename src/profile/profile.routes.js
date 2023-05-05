const { Router } = require('express');
const { editProfile, createPastEvent } = require('./profile.controllers');
const upload = require('../helpers/multer');
const router = Router();

router.put('/update', upload.single('photo'), editProfile);

router.post('/event/add', upload.single('eventPhoto'), createPastEvent);

module.exports = router;
