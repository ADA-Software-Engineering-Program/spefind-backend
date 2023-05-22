const { Router } = require('express');

const router = Router();
const { userAuthentication } = require('../helpers/auth');

router.use('/auth', require('../auth/auth.routes'));

router.use('/feed', userAuthentication, require('../feed/feed.routes'));

router.use('/fields', userAuthentication, require('../fields/field.routes'));

router.use('/user', userAuthentication, require('../user/user.routes'));

router.use(
  '/comment',
  userAuthentication,
  require('../comments/comment.routes')
);

module.exports = router;
