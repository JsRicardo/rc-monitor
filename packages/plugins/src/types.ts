/** 资源加载错误数据 */
export interface ResourceErrorData {
  /** 资源类型 */
  resourceType: 'script' | 'link' | 'img' | 'audio' | 'video' | 'iframe';
  /** 资源URL */
  src: string;
  /** 错误消息 */
  message: string;
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

export const PERFORMANCE_NAME = {
  LCP: 'lcp',
  FCP: 'fcp',
  FP: 'fp',
  CLS: 'cls',
  INP: 'inp',
  TTFB: 'ttfb',
  FIRST_BYTE: 'firstByte',
  DOWNLOAD: 'download',
  DOM_CONTENT_LOADED: 'domContentLoaded',
  LOAD: 'load',
} as const;

export const PERFORMANCE_METRIC = {
  NAVIGATION: 'navigation',
  RESOURCE: 'resource',
  PAINT: 'paint',
  LONG_TASK: 'longtask',
} as const;

export const PERFORMANCE_UNIT = {
  MS: 'ms',
  BYTE: 'byte',
  COUNT: 'count',
} as const;

export type PerformanceName = (typeof PERFORMANCE_NAME)[keyof typeof PERFORMANCE_NAME];
export type PerformanceMetric = (typeof PERFORMANCE_METRIC)[keyof typeof PERFORMANCE_METRIC];
export type PerformanceUnit = (typeof PERFORMANCE_UNIT)[keyof typeof PERFORMANCE_UNIT];

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

export type performanceResults = Record<PerformanceName, PerformanceData>;

export type Reporter = (data: PerformanceData) => void;
