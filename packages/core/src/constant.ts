export const REPORTER_TYPE = {
  IMAGE: 'image',
  SEND_BEACON: 'sendBeacon',
  XHR: 'xhr',
  FETCH: 'fetch',
} as const;

export const REPORT_TYPE = {
  JS_ERROR: 'js-error',
  PROMISE_REJECTION: 'promise-rejection',
  RESOURCE_ERROR: 'resource-error',
  PERFORMANCE: 'performance',
  USER_BEHAVIOR: 'user-behavior',
} as const;
