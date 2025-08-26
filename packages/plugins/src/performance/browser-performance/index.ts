import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';

import { PERFORMANCE_NAME } from '../../types';

import { observeFCP } from './observeFCP';
import { observeFP } from './observeFP';
import { observeINP } from './observeINP';
import { observeLCP } from './observeLCP';

import type { PerformanceName, PerformanceData } from '../../types';

/**
 * 浏览器性能插件
 * 用于采集浏览器性能指标
 */
export class BrowserPerformancePlugin implements Plugin {
  name = PLUGIN_NAMES.BROWSER_PERFORMANCE;

  private monitor?: Monitor;

  private readonly observerMap = new Map<
    PerformanceName,
    (reporter: BrowserPerformancePlugin['reporter']) => void
  >([
    [PERFORMANCE_NAME.FCP, observeFCP],
    [PERFORMANCE_NAME.INP, observeINP],
    [PERFORMANCE_NAME.LCP, observeLCP],
    [PERFORMANCE_NAME.FP, observeFP],
  ]);

  /**
   * 浏览器性能插件
   * @param metrics 性能指标
   * @param inspector 性能指标处理函数
   */
  constructor(
    private readonly metrics?: PerformanceName[],
    private readonly inspector?: <T>(data: PerformanceData) => T
  ) {}

  private reporter(data: PerformanceData) {
    const res = this.inspector?.(data) || data;
    this.monitor?.report(REPORT_TYPE.PERFORMANCE, res);
  }

  private initialObservers() {
    if (this.metrics?.length) {
      this.metrics.forEach(metric => {
        const observer = this.observerMap.get(metric);
        if (observer) observer(this.reporter.bind(this));
      });
    } else {
      this.observerMap.forEach(observer => observer(this.reporter.bind(this)));
    }
  }

  install(monitor: Monitor): void {
    console.log('BrowserPerformancePlugin install');
    this.monitor = monitor;

    try {
      this.initialObservers();
    } catch (error) {
      console.error('BrowserPerformancePlugin error', error);
    }
  }

  uninstall(): void {
    console.log('BrowserPerformancePlugin uninstall');
  }
}
