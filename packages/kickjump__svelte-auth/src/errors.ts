import { isString } from 'is-what';
import { objectEntries } from 'ts-extras';

interface ServerErrorProps {
  code: ErrorCode | ErrorCodeKey;
  message?: string | undefined;
  /**
   * Provide a response which will be returned. Typically this is a redirect.
   */
  response?: Response | undefined;
  /**
   * Combined errors.
   */
  errors?: unknown[];
}

export class ServerError extends AggregateError {
  /**
   * Predicate to check if the error is a `ServerError`.
   */
  static is(value: unknown): value is ServerError {
    return value instanceof ServerError;
  }

  /**
   * Takes an error and converts it to an unknown ServerError.
   */
  static as(error: unknown, code?: ErrorCode | ErrorCodeKey): ServerError {
    if (ServerError.is(error)) {
      return error;
    }

    const message = error instanceof Error ? error.message : 'An unknown error occurred.';

    return new ServerError({ code: code ?? 'InternalServerError', message, errors: [error] });
  }

  /**
   * Create an authorization error.
   */
  static auth(message: string): ServerError {
    return new ServerError({ code: 'Unauthorized', message });
  }

  code: ErrorCodeKey;
  status: number;
  response?: Response | undefined;

  constructor(props: ServerErrorProps) {
    const { code, message, response, errors = [] } = props;

    super(errors, message);
    this.response = response;

    if (isString(code)) {
      this.code = code;
      this.status = ErrorCode[code];
      return;
    }

    this.code = CodeToMessage[code];
    this.status = code;
  }

  toJSON(): ServerErrorJson {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
      error: true,
    };
  }
}

export interface ServerErrorJson {
  code: ErrorCodeKey;
  status: number;
  message: string;
  error: true;
}

export const ErrorCode = {
  /**
   * The request has more than one possible response. The user agent or user
   * should choose one of them. (There is no standardized way of choosing one of
   * the responses, but HTML links to the possibilities are recommended so the
   * user can pick.)
   */
  MultipleChoices: 300,

  /**
   * The URL of the requested resource has been changed permanently. The new URL
   * is given in the response.
   */
  MovedPermanently: 301,

  /**
   * This response code means that the URI of requested resource has been changed
   * temporarily. Further changes in the URI might be made in the future.
   * Therefore, this same URI should be used by the client in future requests.
   */
  Found: 302,

  /**
   * The server sent this response to direct the client to get the requested
   * resource at another URI with a GET request.
   */
  SeeOther: 303,

  /**
   * This is used for caching purposes. It tells the client that the response has
   * not been modified, so the client can continue to use the same cached version
   * of the response.
   */
  NotModified: 304,

  /**
   * Defined in a previous version of the HTTP specification to indicate that a
   * requested response must be accessed by a proxy. It has been deprecated due to
   * security concerns regarding in-band configuration of a proxy.
   */
  UseProxyDeprecated: 305,

  /**
   * This response code is no longer used; it is just reserved. It was used in a
   * previous version of the HTTP/1.1 specification.
   */
  Unused: 306,

  /**
   * The server sends this response to direct the client to get the requested
   * resource at another URI with same method that was used in the prior request.
   * This has the same semantics as the 302 Found HTTP response code, with the
   * exception that the user agent must not change the HTTP method used: if a POST
   * was used in the first request, a POST must be used in the second request.
   */
  TemporaryRedirect: 307,

  /**
   * This means that the resource is now permanently located at another URI,
   * specified by the Location: HTTP Response header. This has the same semantics
   * as the 301 Moved Permanently HTTP response code, with the exception that the
   * user agent must not change the HTTP method used: if a POST was used in the
   * first request, a POST must be used in the second request.
   */
  PermanentRedirect: 308,

  /**
   * The server cannot or will not process the request due to something that is
   * perceived to be a client error (e.g., malformed request syntax, invalid
   * request message framing, or deceptive request routing).
   */
  BadRequest: 400,

  /**
   * Although the HTTP standard specifies "unauthorized", semantically this
   * response means "unauthenticated". That is, the client must authenticate
   * itself to get the requested response.
   */
  Unauthorized: 401,

  /**
   * This response code is reserved for future use. The initial aim for creating
   * this code was using it for digital payment systems, however this status
   * code is used very rarely and no standard convention exists.
   */
  PaymentRequiredExperimental: 402,

  /**
   * The client does not have access rights to the content; that is, it is
   * unauthorized, so the server is refusing to give the requested resource.
   * Unlike 401 Unauthorized, the client's identity is known to the server.
   */
  Forbidden: 403,

  /**
   * The server can not find the requested resource. In the browser, this means
   * the URL is not recognized. In an API, this can also mean that the endpoint
   * is valid but the resource itself does not exist. Servers may also send this
   * response instead of 403 Forbidden to hide the existence of a resource from
   * an unauthorized client. This response code is probably the most well known
   * due to its frequent occurrence on the web.
   */
  NotFound: 404,

  /**
   * The request method is known by the server but is not supported by the
   * target resource. For example, an API may not allow calling DELETE to remove
   * a resource.
   */
  MethodNotAllowed: 405,

  /**
   * This response is sent when the web server, after performing server-driven
   * content negotiation, doesn't find any content that conforms to the criteria
   * given by the user agent.
   */
  NotAcceptable: 406,

  /**
   * This is similar to 401 Unauthorized but authentication is needed to be done
   * by a proxy.
   */
  ProxyAuthenticationRequired: 407,

  /**
   * This response is sent on an idle connection by some servers, even without
   * any previous request by the client. It means that the server would like to
   * shut down this unused connection. This response is used much more since
   * some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection
   * mechanisms to speed up surfing. Also note that some servers merely shut
   * down the connection without sending this message.
   */
  RequestTimeout: 408,

  /**
   * This response is sent when a request conflicts with the current state of
   * the server.
   */
  Conflict: 409,

  /**
   * This response is sent when the requested content has been permanently
   * deleted from server, with no forwarding address. Clients are expected to
   * remove their caches and links to the resource. The HTTP specification
   * intends this status code to be used for "limited-time, promotional
   * services". APIs should not feel compelled to indicate resources that have
   * been deleted with this status code.
   */
  Gone: 410,

  /**
   * Server rejected the request because the Content-Length header field is not
   * defined and the server requires it.
   */
  LengthRequired: 411,

  /**
   * The client has indicated preconditions in its headers which the server does
   * not meet.
   */
  PreconditionFailed: 412,

  /**
   * Request entity is larger than limits defined by server. The server might
   * close the connection or return an Retry-After header field.
   */
  PayloadTooLarge: 413,

  /**
   * The URI requested by the client is longer than the server is willing to
   * interpret.
   */
  UriTooLong: 414,

  /**
   * The media format of the requested data is not supported by the server, so
   * the server is rejecting the request.
   */
  UnsupportedMediaType: 415,

  /**
   * The range specified by the Range header field in the request cannot be
   * fulfilled. It's possible that the range is outside the size of the target
   * URI's data.
   */
  RangeNotSatisfiable: 416,

  /**
   * This response code means the expectation indicated by the Expect request
   * header field cannot be met by the server.
   */
  ExpectationFailed: 417,

  /**
   * The server refuses the attempt to brew coffee with a teapot.
   */
  IMATeapot: 418,

  /**
   * The request was directed at a server that is not able to produce a
   * response. This can be sent by a server that is not configured to produce
   * responses for the combination of scheme and authority that are included in
   * the request URI.
   */
  MisdirectedRequest: 421,

  /**
   * The request was well-formed but was unable to be followed due to semantic
   * errors.
   */
  UnprocessableEntityWebDav: 422,

  /**
   * The resource that is being accessed is locked.
   */
  LockedWebDav: 423,

  /**
   * The request failed due to failure of a previous request.
   */
  FailedDependencyWebDav: 424,

  /**
   * Indicates that the server is unwilling to risk processing a request that
   * might be replayed.
   */
  TooEarlyExperimental: 425,

  /**
   * The server refuses to perform the request using the current protocol but
   * might be willing to do so after the client upgrades to a different
   * protocol. The server sends an Upgrade header in a 426 response to indicate
   * the required protocol(s).
   */
  UpgradeRequired: 426,

  /**
   * The origin server requires the request to be conditional. This response is
   * intended to prevent the 'lost update' problem, where a client GETs a
   * resource's state, modifies it and PUTs it back to the server, when
   * meanwhile a third party has modified the state on the server, leading to a
   * conflict.
   */
  PreconditionRequired: 428,

  /**
   * The user has sent too many requests in a given amount of time ("rate
   * limiting").
   */
  TooManyRequests: 429,

  /**
   * The server is unwilling to process the request because its header fields
   * are too large. The request may be resubmitted after reducing the size of
   * the request header fields.
   */
  RequestHeaderFieldsTooLarge: 431,

  /**
   * The user agent requested a resource that cannot legally be provided, such
   * as a web page censored by a government.
   */
  UnavailableForLegalReasons: 451,

  /**
   * The server has encountered a situation it does not know how to handle.
   */
  InternalServerError: 500,

  /**
   * The request method is not supported by the server and cannot be handled.
   * The only methods that servers are required to support (and therefore that
   * must not return this code) are GET and HEAD.
   */
  NotImplemented: 501,

  /**
   * This error response means that the server, while working as a gateway to
   * get a response needed to handle the request, got an invalid response.
   */
  BadGateway: 502,

  /**
   * The server is not ready to handle the request. Common causes are a server
   * that is down for maintenance or that is overloaded. Note that together with
   * this response, a user-friendly page explaining the problem should be sent.
   * This response should be used for temporary conditions and the Retry-After
   * HTTP header should, if possible, contain the estimated time before the
   * recovery of the service. The webmaster must also take care about the
   * caching-related headers that are sent along with this response, as these
   * temporary condition responses should usually not be cached.
   */
  ServiceUnavailable: 503,

  /**
   * This error response is given when the server is acting as a gateway and
   * cannot get a response in time.
   */
  GatewayTimeout: 504,

  /**
   * The HTTP version used in the request is not supported by the server.
   */
  HttpVersionNotSupported: 505,

  /**
   * The server has an internal configuration error: the chosen variant resource
   * is configured to engage in transparent content negotiation itself, and is
   * therefore not a proper end point in the negotiation process.
   */
  VariantAlsoNegotiates: 506,

  /**
   * The method could not be performed on the resource because the server is
   * unable to store the representation needed to successfully complete the
   * request.
   */
  InsufficientStorageWebDav: 507,

  /**
   * The server detected an infinite loop while processing the request.
   */
  LoopDetectedWebDav: 508,

  /**
   * Further extensions to the request are required for the server to fulfill
   * it.
   */
  NotExtended: 510,

  /**
   * Indicates that the client needs to authenticate to gain network access.
   */
  NetworkAuthenticationRequired: 511,
} as const;

export const CodeToMessage = Object.fromEntries(
  objectEntries(ErrorCode).map((name, code) => [code, name]),
) as unknown as ReverseMap<typeof ErrorCode>;

export type ErrorCodeKey = keyof typeof ErrorCode;
export type ErrorCode = typeof ErrorCode[ErrorCodeKey];
type ReverseMap<Type extends Record<keyof Type, keyof any>> = {
  [Value in Type[keyof Type]]: {
    [Key in keyof Type]: Type[Key] extends Value ? Key : never;
  }[keyof Type];
};

export const ErrorEnum = { ...ErrorCode, CodeToMessage };
