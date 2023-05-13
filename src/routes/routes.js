const { Router } = require('express');

const router = Router();
const { userAuthentication } = require('../helpers/auth');

router.use('/auth', require('../auth/auth.routes'));

router.use('/feed', require('../feed/feed.routes'));

router.use('/fields', require('../fields/field.routes'));

router.use('/user', userAuthentication, require('../user/user.routes'));

module.exports = router;
