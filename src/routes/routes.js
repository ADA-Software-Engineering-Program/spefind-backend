const { Router } = require('express');
const { userAuthentication } = require('../helpers/auth');
const router = Router();

router.use('/auth', require('../auth/auth.routes'));

router.use(
  '/profile',
  userAuthentication,
  require('../profile/profile.routes')
);

module.exports = router;
