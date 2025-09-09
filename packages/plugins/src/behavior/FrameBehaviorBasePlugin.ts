import { Plugin, Monitor, REPORT_TYPE, ReportType } from '@rc-monitor/core';

import { FrameworkBehaviorPluginOptions, PerformanceReporter } from '../types';

type FrameworkBehaviorPluginMetric = 'pageChange' | 'pv' | 'userAction';

type ObserverFuncMap = Map<
  FrameworkBehaviorPluginMetric,
  (reporter: PerformanceReporter) => () => void
>;

export default class FrameBehaviorBasePlugin implements Plugin {
  public name = '';

  protected monitor?: Monitor;

  protected cleanupFns: (() => void)[] = [];

  protected readonly observerMap?: ObserverFuncMap;

  protected reportType: ReportType = REPORT_TYPE.JS_ERROR;

  protected metrics: FrameworkBehaviorPluginMetric[] = [];

  constructor(protected readonly options?: FrameworkBehaviorPluginOptions) {
    this.metrics = this.formatMetrics(this.options?.metrics);
  }

  protected formatMetrics(
    metrics?: FrameworkBehaviorPluginOptions['metrics']
  ): FrameworkBehaviorPluginMetric[] {
    let res = [];
    metrics?.pageChange && res.push('pageChange');
    metrics?.pv && res.push('pv');
    metrics?.userAction && res.push('userAction');
    return res as FrameworkBehaviorPluginMetric[];
  }

  protected reporter(data: any) {
    const res = this.options?.inspector?.(data) || data;
    this.monitor?.report(this.reportType, res);
  }

  protected initialObservers() {
    const defaultMetrics = Array.from(this.observerMap!.keys());
    const performanceMetrics = this.metrics.length ? this.metrics : defaultMetrics;

    performanceMetrics.forEach(metric => {
      if (metric) {
        const observer = this.observerMap!.get(metric);
        if (observer) {
          const cleanupFn = observer(this.reporter.bind(this));
          cleanupFn && this.cleanupFns.push(cleanupFn);
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
