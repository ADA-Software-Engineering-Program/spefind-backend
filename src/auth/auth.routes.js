const { Router } = require('express');
const {
  register,
  login,
  forgotPassword,
  confirmOTP,
  resendOTP,
  nameInput,
  passwordInput,
  uploadProfilePhoto,
  changePassword,
  updatePassword,
  editProfile,
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
  '/name/input',
  nameValidator,
  checkUserName,
  userAuthentication,
  verifiedEmailAuthorization,
  nameInput
);

router.post('/confirm/otp', userAuthentication, confirmOTP);

router.post('/otp/resend', userAuthentication, resendOTP);

router.put(
  '/password/input',
  passwordValidator,
  userAuthentication,
  verifiedEmailAuthorization,
  passwordInput
);

router.post('/login', loginValidator, login);

router.put(
  '/image/upload',
  userAuthentication,
  upload.single('photo'),
  uploadProfilePhoto
);

// router.put('/change/password', userAuthentication, changePassword);

// router.patch('/update/password', userAuthentication, updatePassword);

module.exports = router;
