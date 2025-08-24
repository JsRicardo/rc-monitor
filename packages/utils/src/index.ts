import ERRParser, { StackFrame } from 'error-stack-parser';

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

/**
 * 解析错误对象，提取结构化信息
 * @param error 错误对象
 * @param options 解析选项
 * @returns 解析后的错误信息
 */
export function parseError(error: any, options: ErrorParseOptions = {}): ParsedError {
  const { parseStack = true, maxStackFrames = 10 } = options;

  const parsedError: ParsedError = {
    message: error?.message || String(error),
    name: error?.name || 'Error',
    stack: error?.stack,
    rawError: error,
  };

  if (parseStack && error?.stack) {
    try {
      const stackFrames = parseStackFrames(error.stack, maxStackFrames);
      parsedError.stackFrames = stackFrames;

      // 提取第一个堆栈帧的文件名、行号和列号
      if (stackFrames.length > 0) {
        const firstFrame = stackFrames[0];
        parsedError.fileName = firstFrame.fileName;
        parsedError.lineNumber = firstFrame.lineNumber;
        parsedError.columnNumber = firstFrame.columnNumber;
      }
    } catch (e) {
      // 堆栈解析失败，忽略错误
      console.log('parseError', e);
    }
  }

  return parsedError;
}

/**
 * 解析堆栈字符串为结构化堆栈帧
 * @param stack 堆栈字符串
 * @param maxFrames 最大堆栈帧数
 * @returns 堆栈帧数组
 */
export function parseStackFrames(stack: string, maxFrames: number = 10): StackFrame[] {
  try {
    const frames = ERRParser.parse({ stack } as Error);
    return frames.slice(0, maxFrames);
  } catch (e) {
    console.log('parseStackFrames', e);

    return [];
  }
}

/**
 * 从错误对象中提取文件名、行号和列号
 * @param error 错误对象
 * @returns 包含位置信息的对象
 */
export function extractErrorLocation(error: any): {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
} {
  const parsed = parseError(error, { parseStack: true, maxStackFrames: 1 });
  return {
    fileName: parsed.fileName,
    lineNumber: parsed.lineNumber,
    columnNumber: parsed.columnNumber,
  };
}

/**
 * 判断是否为Promise rejection错误
 * @param error 错误对象
 * @returns 是否为Promise rejection错误
 */
export function isPromiseRejection(error: any): boolean {
  return (
    error instanceof PromiseRejectionEvent || error?.constructor?.name === 'PromiseRejectionEvent'
  );
}

/**
 * 从Promise rejection事件中提取错误信息
 * @param event Promise rejection事件
 * @returns 解析后的错误信息
 */
export function parsePromiseRejection(event: any): ParsedError {
  const reason = event?.reason || event;
  return parseError(reason);
}
