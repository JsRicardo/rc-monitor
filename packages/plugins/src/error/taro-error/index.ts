import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { createJsErrorData, JsErrorData } from '@rc-monitor/utils';

export class TaroErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.TARO_ERROR;

  private errorHandler: ((error: Error) => void) | null = null;
  private rejectionHandler: ((error: PromiseRejectionEvent) => void) | null = null;

  constructor(
    private readonly Taro: Record<string, unknown>,
    private readonly inspector?: <T>(data: JsErrorData) => T
  ) {}

  install(monitor: Monitor): void {
    // 获取Taro全局对象
    if (!this.Taro) {
      console.warn('TaroErrorPlugin: Taro global object not found, plugin not installed');
      return;
    }

    // 捕获JavaScript运行时错误
    this.errorHandler = (error: Error) => {
      const errorData = createJsErrorData(error, REPORT_TYPE.JS_ERROR);
      const data = this.inspector?.(errorData) || errorData;
      monitor.report(REPORT_TYPE.JS_ERROR, data);
    };

    // 捕获未处理的Promise拒绝
    this.rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorData = createJsErrorData(event.reason, REPORT_TYPE.PROMISE_REJECTION);
      const data = this.inspector?.(errorData) || errorData;
      monitor.report(REPORT_TYPE.PROMISE_REJECTION, data);
    };

    // 注册事件监听
    // Taro的错误监听方式
    if (typeof this.Taro.onError === 'function') {
      this.Taro.onError(this.errorHandler);
    }

    if (typeof this.Taro.onUnhandledRejection === 'function') {
      this.Taro.onUnhandledRejection(this.rejectionHandler);
    }

    console.log('Taro error plugin installed');
  }

  uninstall(): void {
    if (!this.Taro) {
      return;
    }

    typeof this.Taro.offError === 'function' && this.Taro.offError(this.errorHandler);
    typeof this.Taro.offUnhandledRejection === 'function' &&
      this.Taro.offUnhandledRejection(this.rejectionHandler);

    console.log('Taro error plugin uninstalled');
  }
}
