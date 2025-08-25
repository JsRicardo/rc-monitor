import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { createJsErrorData } from '@rc-monitor/utils';

export class WeappErrorPlugin implements Plugin {
  name = PLUGIN_NAMES.WEAPP_ERROR;

  private errorHandler: ((error: Error) => void) | null = null;
  private rejectionHandler: ((event: any) => void) | null = null;
  private pageNotFoundHandler: ((res: any) => void) | null = null;

  install(monitor: Monitor): void {
    // 获取小程序全局对象
    const wx = (global as any).wx;
    if (!wx) {
      console.warn('WeappErrorPlugin: wx global object not found, plugin not installed');
      return;
    }

    // 捕获JavaScript运行时错误
    this.errorHandler = (error: Error) => {
      const errorData = createJsErrorData(error, REPORT_TYPE.JS_ERROR);
      monitor.report(REPORT_TYPE.JS_ERROR, errorData);
    };

    // 捕获未处理的Promise拒绝
    this.rejectionHandler = (error: any) => {
      const errorData = createJsErrorData(error, REPORT_TYPE.PROMISE_REJECTION);
      monitor.report(REPORT_TYPE.PROMISE_REJECTION, errorData);
    };

    // 注册事件监听
    wx.onError(this.errorHandler);
    wx.onUnhandledRejection(this.rejectionHandler);

    console.log('Weapp error plugin installed');
  }

  uninstall(): void {
    // 获取小程序全局对象
    const wx = (global as any).wx;
    if (!wx) {
      return;
    }
    wx.offError(this.errorHandler);
    wx.offUnhandledRejection(this.rejectionHandler);

    console.log('Weapp error plugin uninstalled');
  }
}
