const { Router } = require('express');
const {
  register,
  registerAdmin,
  login,
  forgotPassword,
  confirmOTP,
  changePassword,
  updatePassword,
  editProfile,
} = require('./auth.controllers');
const { checkEmail } = require('../helpers/checkEmail');
// const { registerValidator, loginValidator } = require('../helpers/validate');
const { emailValidator } = require('../helpers/validator');
// const { userAuthentication } = require('../helpers/auth');
// const upload = require('../helpers/multer');
const passport = require('passport');
const router = Router();

router.post('/register', emailValidator, checkEmail, register);

// router.post('/login', loginValidator, login);

// router.put('/password/forgot', forgotPassword);

// router.post('/confirm/otp', userAuthentication, confirmOTP);

// router.put(
//   '/edit/profile',
//   userAuthentication,
// upload.single('photo'),
//   editProfile
// );

// router.put('/change/password', userAuthentication, changePassword);

// router.patch('/update/password', userAuthentication, updatePassword);

module.exports = router;
