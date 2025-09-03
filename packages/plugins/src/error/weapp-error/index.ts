import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { createErrorUuid, createJsErrorData, JsErrorData } from '@rc-monitor/utils';

import { PLUGIN_NAMES } from '../../constant';
export class WeappErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.WEAPP_ERROR;

  private errorHandler: ((error: Error) => void) | null = null;
  private rejectionHandler: ((event: any) => void) | null = null;
  private pageNotFoundHandler: ((res: any) => void) | null = null;

  constructor(
    private readonly wx: any,
    private readonly inspector?: <T>(data: JsErrorData) => T
  ) {}

  install(monitor: Monitor): void {
    // 获取小程序全局对象
    if (!this.wx) {
      console.warn('WeappErrorPlugin: wx global object not found, plugin not installed');
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
    this.rejectionHandler = (error: any) => {
      const errorData = createJsErrorData(error, REPORT_TYPE.PROMISE_REJECTION);
      const uuid = createErrorUuid(errorData);
      const data = this.inspector?.(errorData) || errorData;
      monitor.report(REPORT_TYPE.PROMISE_REJECTION, data, uuid);
    };

    // 注册事件监听

    typeof this.wx.onError === 'function' && this.wx.onError(this.errorHandler);
    typeof this.wx.onUnhandledRejection === 'function' &&
      this.wx.onUnhandledRejection(this.rejectionHandler);

    console.log('Weapp error plugin installed');
  }

  uninstall(): void {
    // 获取小程序全局对象
    if (!this.wx) {
      return;
    }
    typeof this.wx.offError === 'function' && this.wx.offError(this.errorHandler);
    typeof this.wx.offUnhandledRejection === 'function' &&
      this.wx.offUnhandledRejection(this.rejectionHandler);

    console.log('Weapp error plugin uninstalled');
  }
}
