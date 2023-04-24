const { check, validationResult } = require('express-validator');

exports.registerValidator = [
  check('email')
    .trim()
    .isEmail()
    .withMessage(
      'Kindly input a valid email address to register on this platform'
    ),
  check('firstName')
    .trim()
    .isString()
    .withMessage('Oops! The name has to be a string property.')
    .isLength({ min: 3 })
    .withMessage('Minimum of three characters required.'),
  check('lastName')
    .trim()
    .isString()
    .withMessage('Oops! The name has to be a string property.')
    .isLength({ min: 3 })
    .withMessage('Minimum of three characters required.'),
  check('password')
    .isLength({ min: 4 })
    .withMessage('Minimum of four characters required.'),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(400).send({
        error: error.array().map((item) => `${item.param} Error - ${item.msg}`),
      });
    next();
  },
];

exports.loginValidator = [
  check('email')
    .trim()
    .isEmail()
    .withMessage(
      'Kindly input a valid email address already registered on this platform'
    ),
  check('password')
    .isLength({ min: 4 })
    .withMessage('Minimum of four characters required.'),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(400).send({
        error: error.array().map((item) => `${item.param} Error - ${item.msg}`),
      });
    next();
  },
];
