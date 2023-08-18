const { Router } = require('express');
const { getStats } = require('./stat.controller');
const router = Router();

router.get('/get/all', getStats);

module.exports = router;
