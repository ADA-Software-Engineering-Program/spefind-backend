const { Router } = require('express');
const passport = require('passport');
const {
  register,
  login,
  inputEmail,
  verifyEmail,
  updatePassword,
} = require('./auth.controllers');
const { registerValidator, loginValidator } = require('../helpers/validate');
const { checkEmail } = require('../helpers/checkEmail');
const { editProfile } = require('./auth.controllers');
const { userAuthentication } = require('../helpers/auth');
const upload = require('../helpers/multer');

const router = Router();

router.post(
  '/speaker/signup',
  registerValidator,
  checkEmail,
  passport.authenticate('speaker', { session: false }),
  register
);

router.post(
  '/organizer/signup',
  registerValidator,
  checkEmail,
  passport.authenticate('organizer', { session: false }),
  register
);

router.post('/login', loginValidator, login);

router.post('/password/forgot', inputEmail);

router.put('/password/reset', updatePassword);

router.get('/verify', verifyEmail);

module.exports = router;
