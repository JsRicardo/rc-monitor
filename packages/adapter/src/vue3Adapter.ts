import { REPORT_TYPE, type Monitor } from '@rc-monitor/core';
import { createErrorUuid, createJsErrorData, type JsErrorData } from '@rc-monitor/utils';

import type { App } from 'vue';
export interface Vue3AdapterInstance {
  install(app: App): void;
  reportError(error: unknown): void;
}

/**
 * Vue3错误适配器
 * 提供Vue3应用错误捕获和上报功能
 * @param monitor 监控实例
 * @param inspector 可选的数据检查器函数，用于处理错误数据
 * @returns Vue3适配器实例
 */
export default function vue3Adapter(
  monitor: Monitor,
  inspector?: <T>(data: JsErrorData) => T
): Vue3AdapterInstance {
  /**
   * 处理Vue错误并上报
   * @param error 错误对象
   */
  const handleVueError = (error: unknown): void => {
    try {
      const errData = createJsErrorData(error as Error, REPORT_TYPE.JS_ERROR);
      const uuid = createErrorUuid(errData);
      const res = inspector?.(errData) || errData;
      monitor.report(REPORT_TYPE.VUE_ERROR, res, uuid);
    } catch (e) {
      console.error('Error in Vue error handler:', e);
    }
  };

  return {
    /**
     * Vue插件安装方法
     * @param app Vue应用实例
     */
    install(app: App): void {
      // 保存原始错误处理器
      let originErrorHandler =
        app.config.errorHandler ||
        ((err, instance, info) => {
          console.error('Vue error:', err, instance, info);
        });

      // 将监控实例注入到Vue原型
      app.config.globalProperties.$monitor = monitor;

      // 提供全局注入
      app.provide('monitor', monitor);

      // 重写错误处理器
      app.config.errorHandler = (err, instance, info) => {
        // 先调用原始错误处理器
        originErrorHandler(err, instance, info);

        // 处理并上报错误
        handleVueError(err);
      };
    },

    /**
     * 手动上报Vue错误
     * @param error 错误对象
     */
    reportError(error: unknown): void {
      handleVueError(error);
    },
  };
}
