import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { createErrorUuid, createJsErrorData, JsErrorData } from '@rc-monitor/utils';
import Taro from '@tarojs/taro';

import { PLUGIN_NAMES } from '../../constant';
export class TaroErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.TARO_ERROR;

  private errorHandler: ((error: string | ErrorEvent | Error) => void) | null = null;
  private rejectionHandler: ((error: any) => void) | null = null;

  constructor(private readonly inspector?: <T>(data: JsErrorData) => T) {}

  install(monitor: Monitor): void {
    // 获取Taro全局对象
    if (!Taro) {
      console.warn('TaroErrorPlugin: Taro global object not found, plugin not installed');
      return;
    }

    // 捕获JavaScript运行时错误
    this.errorHandler = error => {
      const errorData = createJsErrorData(error as Error, REPORT_TYPE.JS_ERROR);
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
    // Taro的错误监听方式
    if (typeof Taro.onError === 'function') {
      Taro.onError(this.errorHandler);
    }

    if (typeof Taro.onUnhandledRejection === 'function') {
      Taro.onUnhandledRejection(this.rejectionHandler);
    }

    console.log('Taro error plugin installed');
  }

  uninstall(): void {
    if (!Taro) {
      return;
    }

    typeof Taro.offError === 'function' && Taro.offError(this.errorHandler!);
    typeof Taro.offUnhandledRejection === 'function' &&
      Taro.offUnhandledRejection(this.rejectionHandler!);

    console.log('Taro error plugin uninstalled');
  }
}
