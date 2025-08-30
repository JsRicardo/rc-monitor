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

export const USER_BEHAVIOR_ACTION = {
  CLICK: 'click',
  INPUT: 'input',
  SCROLL: 'scroll',
  PAGE_CHANGE: 'pageChange',
  PV: 'pv',
} as const;
