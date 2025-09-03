import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { createErrorUuid, createJsErrorData, JsErrorData } from '@rc-monitor/utils';

import { PLUGIN_NAMES } from '../../constant';
export class UniErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.UNI_ERROR;

  private errorHandler: ((error: Error) => void) | null = null;
  private rejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor(
    private readonly uni: any,
    private readonly inspector?: <T>(data: JsErrorData) => T
  ) {}

  install(monitor: Monitor): void {
    if (!this.uni) {
      console.warn('UniErrorPlugin: uni global object not found, plugin not installed');
      return;
    }

    // 捕获JavaScript运行时错误
    this.errorHandler = (error: Error) => {
      const errorData = createJsErrorData(error, REPORT_TYPE.JS_ERROR);
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

    // 注册事件监听
    // Uni的错误监听方式
    if (typeof this.uni.onError === 'function') {
      this.uni.onError(this.errorHandler);
    }

    if (typeof this.uni.onUnhandledRejection === 'function') {
      this.uni.onUnhandledRejection(this.rejectionHandler);
    }

    console.log('Uni error plugin installed');
  }

  uninstall(): void {
    if (!this.uni) {
      return;
    }

    if (typeof this.uni.offError === 'function') {
      this.uni.offError(this.errorHandler);
    }

    if (typeof this.uni.offUnhandledRejection === 'function') {
      this.uni.offUnhandledRejection(this.rejectionHandler);
    }

    console.log('Uni error plugin uninstalled');
  }
}
