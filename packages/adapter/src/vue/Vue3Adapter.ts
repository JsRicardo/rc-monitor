import { Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { createJsErrorData } from '@rc-monitor/utils';
import { App } from 'vue';

import { DEFAULT_MONITOR_INJECT_KEY } from './constant';
import trackDirective from './trackDirective';
import { Vue3AdapterInstance, VueAdapterOptions } from './types';

/**
 * Vue适配器
 * 提供Vue应用错误捕获和行为跟踪指令功能
 * 作为Vue扩展的统一注册入口
 * @param monitor 监控实例
 * @param options 适配器配置项
 * @returns Vue适配器实例
 */
export default function vue3Adapter(
  monitor: Monitor,
  options: VueAdapterOptions = {}
): Vue3AdapterInstance {
  // 合并默认配置
  const mergedOptions: VueAdapterOptions = {
    enableErrorCapture: true, // 重写vue默认的错误捕获
    enableTrackDirective: true, // 启用v-track
    injectGlobal: true,
    monitorInjectKey: DEFAULT_MONITOR_INJECT_KEY,
    ...options,
  };

  /**
   * 处理Vue错误并上报
   * @param error 错误对象
   */
  const handleVueError = (error: unknown): void => {
    try {
      const errData = createJsErrorData(error as Error, REPORT_TYPE.JS_ERROR);
      const res = mergedOptions.errorInspector?.(errData) || errData;
      monitor.report(REPORT_TYPE.VUE_ERROR, res);
    } catch (e) {
      console.error('Error in Vue error handler:', e);
    }
  };
  /**
   *
   * @param app Vue应用实例
   * @param handleVueError 自定义错误处理函数
   */
  const rewriteVueErrorHandler = (app: App, handleVueError: (error: unknown) => void) => {
    let originErrorHandler =
      app.config.errorHandler ||
      ((err, instance, info) => {
        console.error('Vue error:', err, instance, info);
      });

    // 重写错误处理器
    app.config.errorHandler = (err, instance, info) => {
      // 先调用原始错误处理器
      originErrorHandler(err, instance, info);
      // 处理并上报错误
      handleVueError(err);
    };
  };

  return {
    /**
     * Vue插件安装方法
     * @param app Vue应用实例
     */
    install(app: App): void {
      try {
        // 提供monitor实例
        mergedOptions.provide && app.provide(mergedOptions.monitorInjectKey, monitor);
        // 重写vue默认的错误捕获
        mergedOptions.enableErrorCapture && rewriteVueErrorHandler(app, handleVueError);
        // 启用v-track指令
        mergedOptions.enableTrackDirective &&
          trackDirective(app, monitor, mergedOptions.errorInspector);
        // 全局注入monitor实例
        if (mergedOptions.injectGlobal) {
          app.config.globalProperties.$monitor = monitor;
        }
      } catch (e) {
        console.error('Error in Vue adapter install:', e);
      }
    },
  };
}
