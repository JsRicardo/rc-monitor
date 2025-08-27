import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { createErrorUuid, createJsErrorData, type JsErrorData } from '@rc-monitor/utils';

export class BrowserErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.BROWSER_ERROR;

  private errorHandler: ((event: ErrorEvent) => void) | null = null;
  private rejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor(private readonly inspector?: <T>(data: JsErrorData) => T) {}

  install(monitor: Monitor): void {
    // 捕获JavaScript运行时错误
    this.errorHandler = (event: ErrorEvent) => {
      const errorData = createJsErrorData(event.error, REPORT_TYPE.JS_ERROR);
      const uuid = createErrorUuid(errorData);
      const data = this.inspector?.(errorData) || errorData;
      monitor.report(REPORT_TYPE.JS_ERROR, data, uuid);
    };

    // 捕获未处理的Promise拒绝
    this.rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorData = createJsErrorData(event.reason, REPORT_TYPE.PROMISE_REJECTION);
      const uuid = createErrorUuid(errorData);
      const data = this.inspector?.(errorData) || errorData;
      monitor.report(REPORT_TYPE.PROMISE_REJECTION, data, uuid);
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
