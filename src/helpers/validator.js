const Joi = require('joi');
const { check, validationResult } = require('express-validator');
const ApiError = require('./error');

const nameSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(new ApiError(400, 'Kindly input a valid string as firstName...')),

  lastName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(new ApiError(400, 'Kindly input a valid string as lastName...')),
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .error(new ApiError(400, 'Kindly input a valid string as username...')),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .email()
    .trim()
    .required()
    .error(new ApiError(400, 'Oops! A valid email is actually required here!')),
});
const passwordSchema = Joi.object({
  password: Joi.string()
    .min(5)
    .max(30)
    .required()
    .trim()
    .error(
      new ApiError(
        400,
        'Kindly input a password between 5 and 30 characters...'
      )
    ),
});

const passwordValidator = async (req, res, next) => {
  const data = req.body;
  try {
    await passwordSchema.validateAsync(data);
    next();
  } catch (error) {
    next(error);
  }
};

const emailValidator = async (req, res, next) => {
  const data = req.body;
  try {
    await emailSchema.validateAsync(data);
    next();
  } catch (error) {
    next(error);
  }
};

const nameValidator = async (req, res, next) => {
  const data = req.body;
  try {
    await nameSchema.validateAsync(data);
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

module.exports = {
  productValidator,
  passwordValidator,
  nameValidator,
  emailValidator,
};
