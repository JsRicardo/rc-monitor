import { REPORT_TYPE } from '@rc-monitor/core';

import BasePlugin from '../../BasePlugin';
import { PERFORMANCE_NAME, PLUGIN_NAMES } from '../../constant';

import { observeCLS } from './observeCLS';
import { observeEntries } from './observeEntries';
import { observeFCP } from './observeFCP';
import { observeFP } from './observeFP';
import { observeINP } from './observeINP';
import { observeLCP } from './observeLCP';
import { observeLoad } from './observeLoad';
import { observeTTFB } from './observeTTFB';

import type { PerformanceObserverMap, PerformancePluginOption } from '../../types';

/**
 * 浏览器性能插件
 * 用于采集浏览器性能指标
 */
export class BrowserPerformancePlugin extends BasePlugin<PerformancePluginOption> {
  name = PLUGIN_NAMES.BROWSER_PERFORMANCE;
  protected reportType = REPORT_TYPE.PERFORMANCE;

  protected readonly observerMap = new Map([
    [PERFORMANCE_NAME.FCP, observeFCP],
    [PERFORMANCE_NAME.INP, observeINP],
    [PERFORMANCE_NAME.LCP, observeLCP],
    [PERFORMANCE_NAME.FP, observeFP],
    [PERFORMANCE_NAME.CLS, observeCLS],
    [PERFORMANCE_NAME.TTFB, observeTTFB],
    [PERFORMANCE_NAME.FIRST_BYTE, observeTTFB],
    [PERFORMANCE_NAME.LOAD, observeLoad],
    [PERFORMANCE_NAME.ENTRIES, observeEntries],
  ]) as PerformanceObserverMap;
}
