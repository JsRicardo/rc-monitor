import { Plugin, Monitor } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { createJsErrorData } from '@rc-monitor/utils';

import { JS_ERROR_TYPE } from '../../types';

export class BrowserErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.BROWSER_ERROR;

  private errorHandler: ((event: ErrorEvent) => void) | null = null;
  private rejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  install(monitor: Monitor): void {
    // 捕获JavaScript运行时错误
    this.errorHandler = (event: ErrorEvent) => {
      const errorData = createJsErrorData(event.error, JS_ERROR_TYPE.JS_ERROR);
      monitor.report(JS_ERROR_TYPE.JS_ERROR, errorData);
    };

    // 捕获未处理的Promise拒绝
    this.rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorData = createJsErrorData(event.reason, JS_ERROR_TYPE.PROMISE_REJECTION);
      monitor.report(JS_ERROR_TYPE.PROMISE_REJECTION, errorData);
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
