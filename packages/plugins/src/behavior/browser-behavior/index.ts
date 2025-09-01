import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';

import { USER_BEHAVIOR_ACTION, PLUGIN_NAMES } from '../../constant';

import onClick from './onClick';
import onInput from './onInput';
import onPageChange from './onPageChange';
import onPV from './onPV';
import onScroll from './onScroll';

import type { UserBehaviorAction, UserBehaviorData, UserBehaviorReporter } from '../../types';

export class BrowserBehaviorPlugin implements Plugin {
  name = PLUGIN_NAMES.BROWSER_BEHAVIOR;

  private monitor?: Monitor;
  private unObservers: (() => void)[] = [];

  private readonly observerMap = new Map<
    UserBehaviorAction,
    (reporter: UserBehaviorReporter) => () => void
  >([
    [USER_BEHAVIOR_ACTION.CLICK, onClick],
    [USER_BEHAVIOR_ACTION.INPUT, onInput],
    [USER_BEHAVIOR_ACTION.SCROLL, onScroll],
    [USER_BEHAVIOR_ACTION.PAGE_CHANGE, onPageChange],
    [USER_BEHAVIOR_ACTION.PV, onPV],
  ]);

  constructor(
    private readonly metrics?: UserBehaviorAction[],
    private readonly inspector?: <T, K>(data: UserBehaviorData<K>) => T
  ) {}

  private reporter<T>(data: UserBehaviorData<T>) {
    const res = this.inspector?.(data) || data;
    this.monitor?.report(REPORT_TYPE.USER_BEHAVIOR, res);
  }

  install(monitor: Monitor): void {
    this.monitor = monitor;
    try {
      if (this.metrics?.length) {
        this.metrics.forEach(metric => {
          const observer = this.observerMap.get(metric);
          if (observer) {
            const unObserver = observer(this.reporter.bind(this));
            unObserver && this.unObservers.push(unObserver);
          }
        });
      } else {
        this.observerMap.forEach(observer => {
          const unObserver = observer(this.reporter.bind(this));
          unObserver && this.unObservers.push(unObserver);
        });
      }
    } catch (e) {
      console.error('BrowserBehaviorPlugin install error', e);
    }
  }

  uninstall(): void {
    this.unObservers.forEach(unObserver => unObserver());
  }
}
