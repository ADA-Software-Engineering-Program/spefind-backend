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
const {
  emailSubscribe,
  allSubscribers,
} = require('../profile/profile.controllers');

router.use('/auth', require('../auth/auth.routes'));

router.use(
  '/profile',
  userAuthentication,
  require('../profile/profile.routes')
);

router.use('/stat', require('../stats/stat.routes'));

router.use('/field', require('../fields/field.routes'));

router.post('/event/type/add', createEventType);

router.get('/event/type/all', getEventTypes);

router.post('/state/add', createState);

router.get('/state/all', getStates);

router.post('/pricing/create', createPricing);

router.get('/pricing/all', getPricing);

router.post('/news/letter/subscribe', emailSubscribe);

router.get('/all/subscribers', allSubscribers);

module.exports = router;
