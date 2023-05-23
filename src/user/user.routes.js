const { Router } = require('express');
const {
  follow,
  unfollow,
  getAllUsers,
  getCurrentUser,
} = require('./user.controllers');

const router = Router();

router.put('/follow', follow);

router.put('/unfollow', unfollow);

router.get('/all', getAllUsers);

router.get('/current', getCurrentUser);

module.exports = router;
