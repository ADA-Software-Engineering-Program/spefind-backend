const { Router } = require('express');
const {
  follow,
  unfollow,
  getAllUsers,
  getCurrentUser,
  requestCredentialReset,
  verifyCode,
  getFollowers,
} = require('./user.controllers');

const router = Router();

router.put('/follow', follow);

router.put('/unfollow', unfollow);

router.patch('/:credential/reset', requestCredentialReset);

router.post('/verify/code', verifyCode);

router.get('/all', getAllUsers);

router.get('/current', getCurrentUser);

router.get('/followers/all', getFollowers);

module.exports = router;
