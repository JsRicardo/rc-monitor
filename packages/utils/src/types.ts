import { StackFrame } from 'error-stack-parser';

export const ERROR_TYPE_METRIC = {
  JS_ERROR: 'js-error',
  PROMISE_REJECTION: 'promise-rejection',
  NETWORK_ERROR: 'network-error',
  RESOURCE_ERROR: 'resource-error',
  PAGE_NOT_FOUND: 'page-not-found',
} as const;

export const SUB_ERROR_TYPE_METRIC = {
  TYPE_ERROR: 'TypeError',
  REFERENCE_ERROR: 'ReferenceError',
  SYNTAX_ERROR: 'SyntaxError',
  RANGE_ERROR: 'RangeError',
  URI_ERROR: 'UriError',
  EVAL_ERROR: 'EvalError',

  NOT_FOUND_ERROR: 'notFoundError',
  TIMEOUT_ERROR: 'timeoutError',
  HTTP_ERROR: 'httpError',
  CUSTOM_ERROR: 'customError',
  UNKNOWN_ERROR: 'unknownError',
  CORS_ERROR: 'corsError',
  NETWORK_ERROR: 'networkError',
} as const;

export type ErrorTypeMetric = (typeof ERROR_TYPE_METRIC)[keyof typeof ERROR_TYPE_METRIC];
export type SubErrorTypeMetric = (typeof SUB_ERROR_TYPE_METRIC)[keyof typeof SUB_ERROR_TYPE_METRIC];

/** JavaScript运行时错误数据 */
export interface RCErrorData {
  /** 错误ID */
  uuid: string;
  /** 错误消息 */
  message: string;
  /** 错误类型 */
  errorType: ErrorTypeMetric;
  /** 子错误类型 */
  subErrorType?: SubErrorTypeMetric;
  /** 资源路经 */
  url?: string;
  /** 页面路经 */
  path?: string;
  /** 文件名 */
  filename?: string;
  /** 行号 */
  lineno?: number;
  /** 列号 */
  colno?: number;
  /** 错误对象字符串表示 */
  error?: string;
  /** 堆栈信息 */
  stack?: string;
  /** 原始错误对象（序列化后的JSON字符串） */
  rawError?: string;
}

export interface ParsedError {
  message: string;
  name: SubErrorTypeMetric;
  stack?: string;
  stackFrames?: StackFrame[];
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  rawError: any;
}
