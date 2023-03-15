const { Router } = require('express');
const { follow, unfollow, getCurrentUser } = require('./user.controllers');

const router = Router();

router.put('/follow', follow);

router.put('/unfollow', unfollow);

router.get('/current', getCurrentUser);

module.exports = router;
