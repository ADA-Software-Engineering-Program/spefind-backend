class ApiError extends Error {
  statusCode;

  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

class BadRequestError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = message;
  }
}

class UnauthorizedError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = message;
  }
}

class ForbiddenError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.message = message;
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = message;
  }
}

class ConflictError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = message;
  }
}

class NoContentError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 204;
    this.message = message;
  }
}

class APIServerError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.message = message;
  }
}

const UnauthenticatedError = UnauthorizedError;

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  UnauthenticatedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  NoContentError,
  APIServerError,
};
module.exports.default = ApiError;
