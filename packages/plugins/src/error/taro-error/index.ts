import { Plugin, Monitor } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { createJsErrorData } from '@rc-monitor/utils';

import { JS_ERROR_TYPE } from '../../types';

export class TaroErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.TARO_ERROR;

  private errorHandler: ((error: Error) => void) | null = null;
  private rejectionHandler: ((event: any) => void) | null = null;

  install(monitor: Monitor): void {
    // 获取Taro全局对象
    const Taro = (global as any).Taro;
    if (!Taro) {
      console.warn('TaroErrorPlugin: Taro global object not found, plugin not installed');
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
    // Taro的错误监听方式
    if (Taro.onError) {
      Taro.onError(this.errorHandler);
    }

    if (Taro.onUnhandledRejection) {
      Taro.onUnhandledRejection(this.rejectionHandler);
    }

    console.log('Taro error plugin installed');
  }

  uninstall(): void {
    const Taro = (global as any).Taro;
    if (!Taro) {
      return;
    }

    Taro.offError(this.errorHandler);
    Taro.offUnhandledRejection(this.rejectionHandler);

    console.log('Taro error plugin uninstalled');
  }
}
