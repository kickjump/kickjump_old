interface BaseStatefulPromise<Value, ErrorType = unknown> {
  /**
   * The underlying promise.
   */
  readonly promise: Promise<Value>;

  /**
   * A synchronous way of checking the promise's internal state.
   */
  readonly status: 'pending' | 'resolved' | 'rejected';

  /**
   * Resolves the promise with a value or the result of another promise.
   * @param value - The value to resolve the promise with.
   */
  resolve: (value: Value) => void;

  /**
   * Reject the promise with a provided reason or error.
   * @param reason - The reason or error to reject the promise with.
   */
  reject: (reason: ErrorType) => void;
}

interface PendingStatefulPromise<Value, ErrorType = unknown>
  extends BaseStatefulPromise<Value, ErrorType> {
  readonly status: 'pending';
  readonly isPending: true;
  readonly isResolved: false;
  readonly isRejected: false;
  readonly value: never;
  readonly error: never;
}

interface RejectedStatefulPromise<Value, ErrorType = unknown>
  extends BaseStatefulPromise<Value, ErrorType> {
  readonly status: 'rejected';
  readonly isPending: false;
  readonly isResolved: false;
  readonly isRejected: true;
  readonly value: never;
  readonly error: ErrorType;
}

interface ResolvedStatefulPromise<Value, ErrorType = unknown>
  extends BaseStatefulPromise<Value, ErrorType> {
  readonly status: 'resolved';
  readonly isPending: false;
  readonly isResolved: true;
  readonly isRejected: false;
  readonly value: Value;
  readonly error: never;
}

export type StatefulPromise<Value = void, ErrorType = unknown> =
  | PendingStatefulPromise<Value, ErrorType>
  | RejectedStatefulPromise<Value, ErrorType>
  | ResolvedStatefulPromise<Value, ErrorType>;

/**
 * Create a deferred promise.
 *
 * ```ts
 * import statefulPromise from 'stateful-promise';
 *
 * const unicornPromise = Promise.resolve(100);
 *
 * function delay(milliseconds) {
 * 	 const stateful = statefulPromise<'🦄'>();
 * 	 setTimeout(stateful.resolve, milliseconds, '🦄');
 *   return stateful;
 * }
 *
 * console.log(await delay(100).promise);
 * //=> '🦄'
 * ```
 */
export function statefulPromise<Value, ErrorType = unknown>(wrappedPromise?: PromiseLike<Value>) {
  let status = 'pending';
  let value: Value | undefined;
  let error: ErrorType | undefined;
  const stateful: StatefulPromise<Value, ErrorType> = Object.create(null);
  const promise = new Promise<Value>((baseResolve, baseReject) => {
    function resolve(resolveValue: Value) {
      if (status !== 'pending') {
        return;
      }

      status = 'resolved';
      value = resolveValue;
      baseResolve(resolveValue);
    }

    function reject(rejectedError: ErrorType) {
      if (status !== 'pending') {
        return;
      }

      status = 'rejected';
      error = rejectedError;
      baseReject(rejectedError);
    }

    wrappedPromise?.then(resolve, reject);

    Object.defineProperties(stateful, {
      pending: { get: () => status, enumerable: true },
      isPending: { get: () => status === 'pending', enumerable: true },
      isResolved: { get: () => status === 'resolved', enumerable: true },
      isRejected: { get: () => status === 'rejected', enumerable: true },
      value: { get: () => value, enumerable: true },
      error: { get: () => error, enumerable: true },
      resolve: { value: resolve },
      reject: { value: reject },
    });
  });

  Object.defineProperty(stateful, 'promise', { value: promise });

  return stateful;
}
