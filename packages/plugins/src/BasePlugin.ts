import { Plugin, Monitor, REPORT_TYPE, ReportType } from '@rc-monitor/core';

import { BasePluginOption } from './types';

export default class BasePlugin<T> implements Plugin {
  public name = '';

  protected monitor?: Monitor;

  protected cleanupFns: (() => void)[] = [];

  protected readonly observerMap?: any;

  protected reportType: ReportType = REPORT_TYPE.JS_ERROR;

  constructor(protected readonly options?: T extends BasePluginOption ? T : undefined) {}

  private reporter(data: any) {
    const res = this.options?.inspector?.(data) || data;
    this.monitor?.report(this.reportType, res);
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
