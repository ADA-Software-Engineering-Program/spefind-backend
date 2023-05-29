const { Router } = require('express');
const {
  register,
  login,
  userBio,
  forgotPassword,
  confirmOTP,
  resendOTP,
  setupProfile,
  editProfile,
  updateField,
  changePassword,
  resetPassword,
} = require('./auth.controllers');
const { checkEmail, checkUserName } = require('../helpers/checkUser');
// const { registerValidator, loginValidator } = require('../helpers/validate');
const {
  emailValidator,
  nameValidator,
  passwordValidator,
} = require('../helpers/validator');
const { loginValidator } = require('../helpers/validate');
const {
  userAuthentication,
  verifiedEmailAuthorization,
} = require('../helpers/auth');
const upload = require('../helpers/multer');
const passport = require('passport');
const router = Router();

router.post('/register', emailValidator, checkEmail, register);

router.put(
  '/profile/setup',
  upload.single('thumbNail'),
  userAuthentication,
  checkUserName,
  verifiedEmailAuthorization,
  setupProfile
);

router.post('/confirm/otp', userAuthentication, confirmOTP);

router.post('/otp/resend', userAuthentication, resendOTP);

// router.put(
//   '/password/input',
//   passwordValidator,
//   userAuthentication,
//   verifiedEmailAuthorization,
//   passwordInput
// );

router.post('/login', loginValidator, login);

router.put(
  '/profile/edit',
  userAuthentication,
  verifiedEmailAuthorization,
  upload.single('thumbNail'),
  editProfile
);

router.put('/bio', userAuthentication, verifiedEmailAuthorization, userBio);

router.post('/input/discipline', userAuthentication, updateField);

router.put('/password/forgot', forgotPassword);

router.put('/password/reset', userAuthentication, resetPassword);

// router.patch('/update/password', userAuthentication, updatePassword);

module.exports = router;
