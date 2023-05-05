const { Router } = require('express');
const router = Router();
const { createField, getAllFields } = require('./field.controllers');

router.post('/add', createField);

router.get('/all', getAllFields);

module.exports = router;
