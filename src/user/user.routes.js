const { Router } = require('express');
const {
  follow,
  unfollow,
  getAllUsers,
  getCurrentUser,
  getFollowers,
} = require('./user.controllers');

const router = Router();

router.put('/follow', follow);

router.put('/unfollow', unfollow);

router.get('/all', getAllUsers);

router.get('/current', getCurrentUser);

router.get('/followers/all', getFollowers);

module.exports = router;
