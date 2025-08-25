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

export const JS_ERROR_TYPE = {
  JS_ERROR: 'js-error',
  PROMISE_REJECTION: 'promise-rejection',
  RESOURCE_ERROR: 'resource-error',
  PERFORMANCE: 'performance',
  USER_BEHAVIOR: 'user-behavior',
} as const;
