/**
 * When this error is encountered should result in a 401 error.
 * It also covers forbidden code 403.
 */
export class AuthorizationError extends Error {}
