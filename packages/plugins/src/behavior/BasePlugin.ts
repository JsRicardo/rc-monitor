import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';

import type { BehaviorPluginOption, UserBehaviorData, BehaviorObserverMap } from '../types';

export class BaseBehaviorPlugin implements Plugin {
  public name = '';

  protected monitor?: Monitor;

  private cleanupFns: (() => void)[] = [];

  protected readonly observerMap?: BehaviorObserverMap;

  constructor(private readonly options?: BehaviorPluginOption) {}

  private reporter<T>(data: UserBehaviorData<T>) {
    const res = this.options?.inspector?.(data) || data;
    this.monitor?.report(REPORT_TYPE.USER_BEHAVIOR, res);
  }

  private initialObservers() {
    const behaviorMetrics = this.options?.metrics || Array.from(this.observerMap!.keys());

    behaviorMetrics.forEach(metric => {
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
