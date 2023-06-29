const { Router } = require('express');

const router = Router();
const { userAuthentication, checkUserExistence } = require('../helpers/auth');

router.use('/auth', require('../auth/auth.routes'));

router.use(
  '/feed',
  userAuthentication,
  checkUserExistence,
  require('../feed/feed.routes')
);

router.use(
  '/fields',
  userAuthentication,
  checkUserExistence,
  require('../fields/field.routes')
);

router.use(
  '/user',
  userAuthentication,
  checkUserExistence,
  require('../user/user.routes')
);

router.use('/meet', require('../meet/meet.routes'));

router.use(
  '/comment',
  userAuthentication,
  require('../comments/comment.routes')
);

router.use(
    '/chat',
    userAuthentication,
    require('../chat/chat.routes')
)

module.exports = router;
