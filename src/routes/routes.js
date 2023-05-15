const { Router } = require('express');
const { userAuthentication } = require('../helpers/auth');
const router = Router();
const {
  createEventType,
  getEventTypes,
  createState,
  createPricing,
  getPricing,
  getStates,
} = require('../fields/field.controllers');

router.use('/auth', require('../auth/auth.routes'));

router.use(
  '/profile',
  userAuthentication,
  require('../profile/profile.routes')
);

router.use('/field', require('../fields/field.routes'));

router.post('/event/type/add', createEventType);

router.get('/event/type/all', getEventTypes);

router.post('/state/add', createState);

router.get('/state/all', getStates);

router.post('/pricing/create', createPricing);

router.get('/pricing/all', getPricing);

module.exports = router;
