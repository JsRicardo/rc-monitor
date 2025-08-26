import { StackFrame } from 'error-stack-parser';

/** JavaScript运行时错误数据 */
export interface JsErrorData {
  /** 错误消息 */
  message: string;
  /** 文件名 */
  filename?: string;
  /** 行号 */
  lineno?: number;
  /** 列号 */
  colno?: number;
  /** 错误对象字符串表示 */
  error?: string;
  /** 堆栈信息 */
  stack?: string;
  /** 原始错误对象（序列化后的JSON字符串） */
  rawError?: string;
  /** 错误类型 */
  errorType: 'js-error' | 'promise-rejection' | 'page-not-found';
}

export interface ParsedError {
  message: string;
  name: string;
  stack?: string;
  stackFrames?: StackFrame[];
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  rawError: any;
}

/** LCP (Largest Contentful Paint) 条目类型 */
export interface LargestContentfulPaint {
  renderTime: number;
  loadTime: number;
  size: number;
  element: Element | null;
}

/** FID (First Input Delay) 条目类型 */
export interface FirstInputDelayEntry {
  processingStart: number;
  startTime: number;
  target: Element | null;
}

/** 导航性能计时类型 */
export interface PerformanceNavigationTiming {
  startTime: number;
  responseStart: number;
  responseEnd: number;
  domContentLoadedEventEnd: number;
  loadEventEnd: number;
}

export enum PerformanceName {
  LCP = 'lcp',
  FCP = 'fcp',
  CLS = 'cls',
  INP = 'inp',
  TTFB = 'ttfb',
  FIRST_BYTE = 'firstByte',
  DOWNLOAD = 'download',
  DOM_CONTENT_LOADED = 'domContentLoaded',
  LOAD = 'load',
}

export enum PerformanceMetric {
  NAVIGATION = 'navigation',
  RESOURCE = 'resource',
  PAINT = 'paint',
  LONG_TASK = 'longtask',
}

export enum PerformanceUnit {
  MS = 'ms',
  BYTE = 'byte',
  COUNT = 'count',
}

/** 性能数据 */
export interface PerformanceData {
  /** 性能指标类型 */
  metric: PerformanceMetric;
  /** 指标名称 */
  name: PerformanceName;
  /** 指标数据 */
  value: number;
  /** 单位 */
  unit: PerformanceUnit;
  /** 额外信息 */
  extras?: Record<string, any>;
}
