const Joi = require('joi');
const ApiError = require('./error');

const authSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(
      new ApiError(400, 'Kindly input the name in the appropriate format...')
    ),

  password: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(new ApiError(400, 'Kindly input a password you would remember...')),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .required()
    .error(new ApiError(400, 'Oops! A valid email is actually required here!')),
});

const emailValidator = async (req, res, next) => {
  const data = req.body;
  try {
    await emailSchema.validateAsync(data);
    next();
  } catch (error) {
    next(error);
  }
};

const authValidate = async (req, res, next) => {
  const data = req.body;
  try {
    await authSchema.validateAsync(data);
    next();
  } catch (error) {
    next(error);
  }
};

const productSchema = Joi.object({
  productName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(
      new ApiError(
        400,
        'Kindly input the name of product in the appropriate format...'
      )
    ),
  category: Joi.string()
    .trim()
    .required()
    .error(
      new ApiError(
        400,
        'Oops! A product must belong in atleast one category...'
      )
    ),
  description: Joi.string()
    .min(3)
    .optional()
    .error(
      new ApiError(400, 'Kindly input detailed description of this product')
    ),

  quantity: Joi.number()
    .optional()
    .error(
      new ApiError(400, 'Kindly indicate how many of this product is available')
    ),

  price: Joi.number()
    .integer()
    .optional()
    .error(
      new ApiError(400, 'Kindly input a valid integer as price of product')
    ),
});

const productValidator = async (req, res, next) => {
  const data = req.body;
  try {
    await productSchema.validateAsync(data);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authValidate, productValidator, emailValidator };
