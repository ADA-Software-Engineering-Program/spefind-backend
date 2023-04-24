const { Router } = require('express');

const router = Router();

router.use('/auth', require('../auth/auth.routes'));

module.exports = router;
