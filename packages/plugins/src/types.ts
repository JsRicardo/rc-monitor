import { PerformanceData, PerformanceName } from '@rc-monitor/utils';

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

export type performanceResults = Record<PerformanceName, PerformanceData>;
