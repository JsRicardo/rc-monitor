import { REPORT_TYPE } from '@rc-monitor/core';

import BasePlugin from '../../BasePlugin';
import { PERFORMANCE_NAME, PLUGIN_NAMES } from '../../constant';
import { PerformancePluginOption } from '../../types';

import observeNavigation from './observeNavigation';
import observeRender from './observeRender';
import observeRequest from './observeRequest';
import observeScript from './observeScript';

export class WeappPerformancePlugin extends BasePlugin<PerformancePluginOption> {
  name = PLUGIN_NAMES.WEAPP_PERFORMANCE;
  protected reportType = REPORT_TYPE.PERFORMANCE;

  protected readonly observerMap = new Map([
    [PERFORMANCE_NAME.REQUEST, observeRequest],
    [PERFORMANCE_NAME.ENTRIES, observeScript],
    [PERFORMANCE_NAME.NAVIGATION, observeNavigation],
    [PERFORMANCE_NAME.PAINT, observeRender],
  ]);

  constructor(options?: PerformancePluginOption) {
    super(options);

    const WEAPP = (globalThis as any).__Monitor_Framework__;
    if (!WEAPP) {
      console.error(
        'WEAPP instance not found, Make sure you are config frameworkInstance correctly.'
      );
    }
  }
}
