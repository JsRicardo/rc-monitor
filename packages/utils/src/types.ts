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
  errorType: 'js-error' | 'promise-rejection' | 'page-not-found';
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

export interface ErrorParseOptions {
  /** 是否解析堆栈信息 */
  parseStack?: boolean;
  /** 最大堆栈帧数 */
  maxStackFrames?: number;
}
