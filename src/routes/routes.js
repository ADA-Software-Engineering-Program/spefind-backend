const { Router } = require('express');

const router = Router();

router.use('/auth', require('../auth/auth.routes'));

router.use('/fields', require('../fields/field.routes'));

module.exports = router;
