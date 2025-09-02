import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';

import type { PerformanceData, PerformancePluginOption, PerformanceObserverMap } from '../types';

/**
 * 浏览器性能插件
 * 用于采集浏览器性能指标
 */
export default class BasePlugin implements Plugin {
  public name = '';

  private monitor?: Monitor;

  private cleanupFns: (() => void)[] = [];

  protected readonly observerMap?: PerformanceObserverMap;

  constructor(private readonly options?: PerformancePluginOption) {}

  private reporter<T>(data: PerformanceData<T>) {
    const res = this.options?.inspector?.(data) || data;
    this.monitor?.report(REPORT_TYPE.PERFORMANCE, res);
  }

  private initialObservers() {
    const performanceMetrics = this.options?.metrics || Array.from(this.observerMap!.keys());

    performanceMetrics.forEach(metric => {
      const observer = this.observerMap!.get(metric);
      if (observer) {
        const cleanupFn = observer(this.reporter.bind(this));
        if (cleanupFn) {
          this.cleanupFns.push(cleanupFn);
        }
      }
    });
  }

  public install(monitor: Monitor): void {
    this.monitor = monitor;

    try {
      this.initialObservers();
    } catch (error) {
      console.error(`${this.name} error`, error);
    }
  }

  public uninstall(): void {
    this.cleanupFns.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.error(`Error during ${this.name} plugin cleanup: `, error);
      }
    });
    this.cleanupFns = [];
  }
}
