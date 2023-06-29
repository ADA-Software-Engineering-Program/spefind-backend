class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

class BadRequestError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 400
    }
}

class UnauthorizedError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 401
    }
}

class ForbiddenError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 403
    }
}

class NotFoundError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 404
    }
}

class ConflictError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 409
    }
}

class NoContentError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 204
    }
}

class APIServerError extends ApiError {
    constructor(message) {
        super(message)
        this.statusCode = 500
    }
}

const UnauthenticatedError = UnauthorizedError

module.exports = {
    ApiError,
    BadRequestError,
    UnauthorizedError,
    UnauthenticatedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    NoContentError,
    APIServerError
}
module.exports.default = ApiError;