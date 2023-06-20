const { Router } = require('express');
const {
  generateRTCToken,
  createProject,
  nocache,
} = require('./meet.controller');
const router = Router();

router.get('/rtc/:channel/:role/:uid', nocache, generateRTCToken);

router.post('/create/project', createProject);

module.exports = router;
