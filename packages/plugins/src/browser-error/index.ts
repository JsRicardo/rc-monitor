import { Plugin, JsErrorData, Monitor } from '@rc-monitor/core';
import { parseError, parsePromiseRejection } from '@rc-monitor/utils';

export class BrowserErrorPlugin implements Plugin {
  name = 'browser-error';

  private errorHandler: ((event: ErrorEvent) => void) | null = null;
  private rejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  /**
   * 创建JsErrorData对象
   */
  private createJsErrorData(
    error: Error | undefined,
    message: string,
    filename: string,
    lineno: number,
    colno: number,
    errorType: 'js-error' | 'promise-rejection'
  ): JsErrorData {
    // 使用utils包解析错误信息
    const parsedError = error ? parseError(error) : null;

    // 如果解析出位置信息，使用解析后的信息
    const finalFilename = parsedError?.fileName || filename;
    const finalLineno = parsedError?.lineNumber || lineno;
    const finalColno = parsedError?.columnNumber || colno;

    return {
      message,
      filename: finalFilename,
      lineno: finalLineno,
      colno: finalColno,
      error: error?.toString(),
      stack: error?.stack,
      rawError: error
        ? JSON.stringify({
            name: error.name,
            message: error.message,
            stack: error.stack,
            parsedError: parsedError,
          })
        : undefined,
      errorType,
    };
  }

  install(monitor: Monitor): void {
    // 捕获JavaScript运行时错误
    this.errorHandler = (event: ErrorEvent) => {
      const errorData = this.createJsErrorData(
        event.error,
        event.message,
        event.filename,
        event.lineno,
        event.colno,
        'js-error'
      );
      monitor.report('js-error', errorData);
    };

    // 捕获未处理的Promise拒绝
    this.rejectionHandler = (event: PromiseRejectionEvent) => {
      // 使用utils包解析Promise rejection错误
      const parsedError = parsePromiseRejection(event);

      const errorData = this.createJsErrorData(
        event.reason,
        event.reason?.message || 'Unhandled promise rejection',
        parsedError.fileName || window.location.href,
        parsedError.lineNumber || 0,
        parsedError.columnNumber || 0,
        'promise-rejection'
      );
      monitor.report('js-error', errorData);
    };

    window.addEventListener('error', this.errorHandler);
    window.addEventListener('unhandledrejection', this.rejectionHandler);

    console.log('Browser error plugin installed');
  }

  uninstall(): void {
    // 清理事件监听器
    if (this.errorHandler) {
      window.removeEventListener('error', this.errorHandler);
    }
    if (this.rejectionHandler) {
      window.removeEventListener('unhandledrejection', this.rejectionHandler);
    }

    console.log('Browser error plugin uninstalled');
  }
}
