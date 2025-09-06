import ERRParser, { StackFrame } from 'error-stack-parser';

import type { RCErrorData, ParsedError, SubErrorTypeMetric } from '../types';

/**
 * 解析堆栈字符串为结构化堆栈帧
 * @param error 错误对象
 * @param maxFrames 最大堆栈帧数
 * @returns 堆栈帧数组
 */
function parseStackFrames(error: Error): StackFrame[] {
  try {
    const frames = ERRParser.parse(error);
    return frames;
  } catch (e) {
    console.log('parseStackFrames', e);

    return [];
  }
}

/**
 * 解析错误对象，提取结构化信息
 * @param error 错误对象
 * @param options 解析选项
 * @returns 解析后的错误信息
 */
export function parseError(error: Error): ParsedError {
  const parsedError: ParsedError = {
    message: error?.message || String(error),
    name: (error?.name || 'Error') as SubErrorTypeMetric,
    stack: error?.stack,
    rawError: error,
  };

  try {
    const stackFrames = parseStackFrames(error);
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

  return parsedError;
}

/**
 * 判断是否为Promise rejection错误
 * @param error 错误对象
 * @returns 是否为Promise rejection错误
 */
export function isPromiseRejection(error: unknown): boolean {
  return (
    error instanceof PromiseRejectionEvent || error?.constructor?.name === 'PromiseRejectionEvent'
  );
}

/**
 *
 * @param error 错误数据
 * @returns 是否为Error对象
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error || error?.constructor?.name === 'Error';
}

/** 根据错误数据创建uuid
 * @param error 错误数据
 * @returns uuid
 */
export function createErrorUuid({
  message,
  fileName,
  lineNumber,
  columnNumber,
}: ParsedError): string {
  return `uuid-${message}-${fileName}-${lineNumber}-${columnNumber}`;
}

/**
 * 创建JsErrorData对象
 * @param error 错误对象
 * @param errorType 错误类型
 * @returns JsErrorData对象
 */
export function createJsErrorData(error: Error, errorType: RCErrorData['errorType']): RCErrorData {
  let parsedError = null;

  try {
    if (isError(error)) {
      parsedError = parseError(error as Error);
    } else {
      parsedError = {} as ParsedError;
    }

    // 如果解析出位置信息，使用解析后的信息
    const { message, fileName, lineNumber, columnNumber, name } = parsedError;

    return {
      uuid: createErrorUuid(parsedError),
      message,
      errorType,
      subErrorType: name,
      filename: fileName,
      lineno: lineNumber,
      colno: columnNumber,
      error: typeof error === 'string' ? error : error?.toString(),
      stack: typeof error === 'object' && error !== null ? error.stack : undefined,
      rawError:
        typeof error === 'object' && error !== null
          ? JSON.stringify({
              name: error.name,
              message: error.message,
              stack: error.stack,
              parsedError: parsedError,
            })
          : undefined,
    };
  } catch (e) {
    console.log(e);
    return {} as RCErrorData;
  }
}
