import {
  PERFORMANCE_METRIC,
  PERFORMANCE_NAME,
  PERFORMANCE_UNIT,
  USER_BEHAVIOR_ACTION,
} from './constant';

/** 资源加载错误数据 */
export interface ResourceErrorData {
  /** 资源类型 */
  resourceType: 'script' | 'link' | 'img' | 'audio' | 'video' | 'iframe';
  /** 资源URL */
  src: string;
  /** 错误消息 */
  message: string;
}
export type UserBehaviorAction = (typeof USER_BEHAVIOR_ACTION)[keyof typeof USER_BEHAVIOR_ACTION];
/** 用户行为数据 */
export interface UserBehaviorData<T> {
  /** 行为类型 */
  action: UserBehaviorAction;
  /** 元素选择器或标识 */
  element: Element['tagName'] | null;
  /** 页面URL */
  url: string;
  /** 时间 */
  timestamp: number;
  /** 事件类型 */
  eventType: string;
  /** 额外数据 */
  extras?: T;
}

export type PerformanceName = (typeof PERFORMANCE_NAME)[keyof typeof PERFORMANCE_NAME];
export type PerformanceMetric = (typeof PERFORMANCE_METRIC)[keyof typeof PERFORMANCE_METRIC];
export type PerformanceUnit = (typeof PERFORMANCE_UNIT)[keyof typeof PERFORMANCE_UNIT];

/** 性能数据 */
export interface PerformanceData<T> {
  /** 性能指标类型 */
  metric: PerformanceMetric;
  /** 指标名称 */
  name: PerformanceName;
  /** 指标数据 */
  value: number;
  /** 单位 */
  unit: PerformanceUnit;
  /** 额外信息 */
  extras?: T;
}

export type PerformanceReporter = <T>(data: PerformanceData<T>) => void;
export type UserBehaviorReporter = <T>(data: UserBehaviorData<T>) => void;
