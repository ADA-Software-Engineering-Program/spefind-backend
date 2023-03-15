const { Router } = require('express');
const { createField, getField, getFields } = require('./field.controller');
const router = Router();

router.post('/create', createField);
router.get('/all/fields', getFields);
router.get('/:_id', getField);

module.exports = router;
