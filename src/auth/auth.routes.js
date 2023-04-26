const { Router } = require('express');
const passport = require('passport');
const { register, login } = require('./auth.controllers');
const { registerValidator, loginValidator } = require('../helpers/validate');
const { checkEmail } = require('../helpers/checkEmail');

const router = Router();

router.post(
  '/speaker/signup',
  loginValidator,
  checkEmail,
  passport.authenticate('speaker', { session: false }),
  register
);

router.post(
  '/organizer/signup',
  registerValidator,
  passport.authenticate('organizer', { session: false }),
  register
);

router.post('/login', loginValidator, login);

module.exports = router;
