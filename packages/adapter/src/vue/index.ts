import { Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { createErrorUuid, createJsErrorData, JsErrorData } from '@rc-monitor/utils';
import { App, inject, InjectionKey } from 'vue';

import trackDirective from './trackDirective';

export interface TrackParams {
  action: string;
  timestamp: number;
  eventType: string;
  element: string;
  extras?: Record<string, any>;
}

/**
 * Vue适配器配置项
 */
export interface VueAdapterOptions {
  /** 是否启用错误捕获功能 */
  enableErrorCapture?: boolean;
  /** 是否启用行为跟踪指令 */
  enableTrackDirective?: boolean;
  /** 是否提供monitor实例 */
  provide?: boolean;
  /** 是否全局注入monitor实例 */
  injectGlobal?: boolean;
  /** 自定义错误数据处理函数 */
  errorInspector?: <T>(error: JsErrorData | TrackParams) => T;
  /** 自定义监控器注入的key */
  monitorInjectKey?: InjectionKey<Monitor>;
}

/**
 * Vue适配器实例接口
 */
export interface Vue3AdapterInstance {
  install(app: App): void;
}

const DEFAULT_MONITOR_INJECT_KEY: InjectionKey<Monitor> = Symbol.for('monitor');

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
      const uuid = createErrorUuid(errData);
      const res = mergedOptions.errorInspector?.(errData) || errData;
      monitor.report(REPORT_TYPE.VUE_ERROR, res, uuid);
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

/**
 * 获取monitor实例方法
 * @returns monitor实例
 */
export function useRCMonitor(monitorInjectKey?: InjectionKey<Monitor>) {
  const monitor = inject(monitorInjectKey || DEFAULT_MONITOR_INJECT_KEY);
  if (!monitor) {
    throw new Error('monitor is not provided，please check the adapter options');
  }
  return monitor;
}
