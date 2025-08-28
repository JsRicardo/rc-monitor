import { StackFrame } from 'error-stack-parser';

export const RC_ERROR_TYPE = {
  JS_ERROR: 'js-error',
  PROMISE_REJECTION: 'promise-rejection',
  PAGE_NOT_FOUND: 'page-not-found',
} as const;

export type RcErrorType = (typeof RC_ERROR_TYPE)[keyof typeof RC_ERROR_TYPE];

/** JavaScript运行时错误数据 */
export interface JsErrorData {
  /** 错误消息 */
  message: string;
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
  /** 错误类型 */
  errorType: RcErrorType;
}

export interface ParsedError {
  message: string;
  name: string;
  stack?: string;
  stackFrames?: StackFrame[];
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  rawError: any;
}
