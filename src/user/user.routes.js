const { Router } = require('express');
const {
  follow,
  unfollow,
  getAllUsers,
  getCurrentUser,
  requestCredentialReset,
  updateCredential,
  verifyCode,
  updateProfile,
  getFollowers,
} = require('./user.controllers');

const router = Router();

router.put('/follow', follow);

router.put('/unfollow', unfollow);

router.put('/profile/:credential/update', updateCredential);

router.patch('/:credential/reset', requestCredentialReset);

router.put('/info/update', updateProfile);

router.post('/verify/code', verifyCode);

router.get('/all', getAllUsers);

router.get('/current', getCurrentUser);

router.get('/followers/all', getFollowers);

module.exports = router;
