const { check, validationResult } = require('express-validator');

exports.loginValidator = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Kindly input a valid registered email address'),
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
