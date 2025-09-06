import { Monitor } from '@rc-monitor/core';
import { type RCErrorData } from '@rc-monitor/utils';
import { InjectionKey, App } from 'vue';

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
  errorInspector?: <T>(error: RCErrorData | TrackParams) => T;
  /** 自定义监控器注入的key */
  monitorInjectKey?: InjectionKey<Monitor>;
}

/**
 * Vue适配器实例接口
 */
export interface Vue3AdapterInstance {
  install(app: App): void;
}
