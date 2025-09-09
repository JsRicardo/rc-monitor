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
  ENTRIES: 'entries',
  REQUEST: 'request',
  NAVIGATION: 'navigation',
  PAINT: 'paint',
} as const;

export const PERFORMANCE_METRIC = {
  NAVIGATION: 'navigation',
  RESOURCE: 'resource',
  PAINT: 'paint',
  LONG_TASK: 'longtask',
  REQUEST: 'request',
} as const;

export const PERFORMANCE_UNIT = {
  MS: 'ms',
  BYTE: 'byte',
  COUNT: 'count',
} as const;

export const USER_BEHAVIOR_ACTION = {
  CLICK: 'click',
  INPUT: 'input',
  TAP: 'tap',
  CHANGE: 'change',
  SCROLL: 'scroll',
  PAGE_CHANGE: 'pageChange',
  PV: 'pv',
} as const;

export const FRAMEWORK_USER_BEHAVIOR_ACTION = {
  CLICK: 'click',
  INPUT: 'input',
  TAP: 'tap',
  CHANGE: 'change',
  SCROLL: 'scroll',
} as const;

// 平台插件名称常量
export const PLUGIN_NAMES = {
  BROWSER_ERROR: 'browser-error',
  BROWSER_PERFORMANCE: 'browser-performance',
  BROWSER_BEHAVIOR: 'browser-behavior',
  WEAPP_BEHAVIOR: 'weapp-behavior',
  WEAPP_ERROR: 'weapp-error',
  WEAPP_PERFORMANCE: 'weapp-performance',
  REACT_ERROR_BOUNDARY: 'react-error-boundary',
  VUE_ERROR_HANDLER: 'vue-error-handler',
  TARO_ERROR: 'taro-error',
  TARO_PERFORMANCE: 'taro-performance',
  TARO_BEHAVIOR: 'taro-behavior',
  UNI_ERROR: 'uni-error',
  UNI_PERFORMANCE: 'uni-performance',
  UNI_BEHAVIOR: 'uni-behavior',
} as const;
