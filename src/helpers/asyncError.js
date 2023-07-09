const logger = require('./logger');
const ApiErrors = require('./errors');
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiErrors)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An error occurred';
    error = new ApiErrors(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'An error occured';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
