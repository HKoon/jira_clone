/* eslint-disable max-classes-per-file */

type ErrorData = { [key: string]: any };

export class CustomError extends Error {
  constructor(
    public message: string,
    public code: string | number = 'INTERNAL_ERROR',
    public status: number = 500,
    public data: ErrorData = {},
  ) {
    super();
  }
}

export class RouteNotFoundError extends CustomError {
  constructor(originalUrl: string) {
    super(`Route '${originalUrl}' does not exist.`, 'ROUTE_NOT_FOUND', 404);
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(entityName: string) {
    super(`${entityName} not found.`, 'ENTITY_NOT_FOUND', 404);
  }
}

export class BadUserInputError extends CustomError {
  constructor(errorData: ErrorData) {
    super('There were validation errors.', 'BAD_USER_INPUT', 400, errorData);
  }
}

export class InvalidTokenError extends CustomError {
  constructor(message = 'Authentication token is invalid.') {
    super(message, 'INVALID_TOKEN', 401);
  }
}

export class InvalidCredentialsError extends CustomError {
  constructor(message = 'Invalid email or password.') {
    super(message, 'INVALID_CREDENTIALS', 401);
  }
}

export class EmailAlreadyInUseError extends CustomError {
  constructor(message = 'Email is already in use.') {
    super(message, 'EMAIL_ALREADY_IN_USE', 400);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'Access forbidden.') {
    super(message, 'FORBIDDEN', 403);
  }
}
