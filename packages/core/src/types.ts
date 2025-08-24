/**
 * 类型定义文件
 * 包含所有公共接口和类型定义
 */

import { Monitor } from './monitor';

export interface MonitorConfig {
  /** 数据上报地址 */
  endpoint: string;
  /** 应用ID */
  appId: string;
  /** 上报间隔（毫秒） */
  reportInterval?: number;
  /** 最大缓存数据条数 */
  maxCacheSize?: number;
  /** 是否启用调试模式 */
  debug?: boolean;
}

export interface Plugin {
  /** 插件名称 */
  name: string;
  /** 插件安装方法 */
  install(monitor: Monitor): void;
  /** 插件卸载方法 */
  uninstall?(): void;
}

export interface ReportData {
  /** 数据类型 */
  type: string;
  /** 数据内容 */
  data: any;
  /** 时间戳 */
  timestamp: number;
  /** 应用ID */
  appId: string;
}

/** JavaScript运行时错误数据 */
export interface JsErrorData {
  /** 错误消息 */
  message: string;
  /** 文件名 */
  filename: string;
  /** 行号 */
  lineno: number;
  /** 列号 */
  colno: number;
  /** 错误对象字符串表示 */
  error?: string;
  /** 堆栈信息 */
  stack?: string;
  /** 原始错误对象（序列化后的JSON字符串） */
  rawError?: string;
  /** 错误类型 */
  errorType: 'js-error' | 'promise-rejection';
}

/** Promise拒绝数据 */
export interface PromiseRejectionData {
  /** 拒绝原因 */
  reason?: string;
  /** Promise对象 */
  promise: any;
}

/** 资源加载错误数据 */
export interface ResourceErrorData {
  /** 资源类型 */
  resourceType: 'script' | 'link' | 'img' | 'audio' | 'video' | 'iframe';
  /** 资源URL */
  src: string;
  /** 错误消息 */
  message: string;
}

/** 性能数据 */
export interface PerformanceData {
  /** 性能指标类型 */
  metric: 'navigation' | 'resource' | 'paint' | 'longtask';
  /** 指标数据 */
  value: number;
  /** 单位 */
  unit: 'ms' | 'byte' | 'count';
  /** 额外信息 */
  extras?: Record<string, any>;
}

/** 用户行为数据 */
export interface UserBehaviorData {
  /** 行为类型 */
  action: 'click' | 'input' | 'scroll' | 'navigation' | 'ajax';
  /** 元素选择器或标识 */
  element?: string;
  /** 页面URL */
  url: string;
  /** 额外数据 */
  extras?: Record<string, any>;
}

export interface ReportService {
  /** 发送数据到服务器 */
  sendData(data: ReportData[]): Promise<void>;
}

export interface PluginManager {
  /** 安装插件 */
  use(plugin: Plugin): void;
  /** 卸载插件 */
  unuse(pluginName: string): void;
  /** 卸载所有插件 */
  unuseAllPlugin(): void;
}
