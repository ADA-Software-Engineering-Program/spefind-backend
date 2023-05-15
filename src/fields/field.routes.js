const { Router } = require('express');
const router = Router();
const {
  createField,
  getAllFields,
  getSubfields,
  createSubfield,
} = require('./field.controllers');

router.post('/add', createField);

router.get('/all', getAllFields);

router.post('/sub/field', createSubfield);

router.get('/sub/field/all', getSubfields);

module.exports = router;
