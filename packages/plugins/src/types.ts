import {
  PERFORMANCE_METRIC,
  PERFORMANCE_NAME,
  PERFORMANCE_UNIT,
  USER_BEHAVIOR_ACTION,
} from './constant';

import type { ErrorTypeMetric, RCErrorData } from '@rc-monitor/utils';

/** 用户行为数据 */
export type UserBehaviorAction = (typeof USER_BEHAVIOR_ACTION)[keyof typeof USER_BEHAVIOR_ACTION];

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

/** 性能数据 */
export type PerformanceName = (typeof PERFORMANCE_NAME)[keyof typeof PERFORMANCE_NAME];
export type PerformanceMetric = (typeof PERFORMANCE_METRIC)[keyof typeof PERFORMANCE_METRIC];
export type PerformanceUnit = (typeof PERFORMANCE_UNIT)[keyof typeof PERFORMANCE_UNIT];

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
export type ErrorReporter = (data: RCErrorData) => void;

export type PerformanceInspector = <T, K>(data: PerformanceData<K>) => T;
export type UserBehaviorInspector = <T, K>(data: UserBehaviorData<K>) => T;
export type ErrorInspector = <T>(data: RCErrorData) => T;

export interface PerformancePluginOption {
  metrics?: PerformanceName[];
  inspector?: PerformanceInspector;
}

export type PerformanceObserverMap = Map<
  PerformanceName,
  (reporter: PerformanceReporter) => () => void
>;

export interface BehaviorPluginOption {
  metrics?: UserBehaviorAction[];
  inspector?: UserBehaviorInspector;
}

export type BehaviorObserverMap = Map<
  UserBehaviorAction,
  (reporter: UserBehaviorReporter) => () => void
>;

export interface ErrorPluginOption {
  metrics?: ErrorTypeMetric[];
  inspector?: ErrorInspector;
}

export interface BasePluginOption {
  metrics?: string[];
  inspector?: (data: any) => void;
}
