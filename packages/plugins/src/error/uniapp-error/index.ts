import { Plugin, Monitor } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { createJsErrorData } from '@rc-monitor/utils';

import { JS_ERROR_TYPE } from '../../types';

export class UniErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.UNI_ERROR;

  private errorHandler: ((error: Error) => void) | null = null;
  private rejectionHandler: ((event: any) => void) | null = null;

  install(monitor: Monitor): void {
    const uni = (global as any).uni;
    if (!uni) {
      console.warn('UniErrorPlugin: uni global object not found, plugin not installed');
      return;
    }

    // 捕获JavaScript运行时错误
    this.errorHandler = (error: Error) => {
      const errorData = createJsErrorData(error, JS_ERROR_TYPE.JS_ERROR);
      monitor.report(JS_ERROR_TYPE.JS_ERROR, errorData);
    };

    // 捕获未处理的Promise拒绝
    this.rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorData = createJsErrorData(event.reason, JS_ERROR_TYPE.PROMISE_REJECTION);
      monitor.report(JS_ERROR_TYPE.PROMISE_REJECTION, errorData);
    };

    // 注册事件监听
    // Uni的错误监听方式
    if (uni.onError) {
      uni.onError(this.errorHandler);
    }

    if (uni.onUnhandledRejection) {
      uni.onUnhandledRejection(this.rejectionHandler);
    }

    console.log('Uni error plugin installed');
  }

  uninstall(): void {
    const uni = (global as any).uni;
    if (!uni) {
      return;
    }
    uni.offError(this.errorHandler);
    uni.offUnhandledRejection(this.rejectionHandler);

    console.log('Uni error plugin uninstalled');
  }
}
