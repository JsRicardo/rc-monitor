import { PERFORMANCE_NAME, PERFORMANCE_METRIC, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

interface IEntry {
  duration: number;
  entryType: 'navigation';
  name: string;
  navigationType: string;
  needDownloadPkgs: false;
  pageId: number;
  path: string;
  startTime: number;
  downloadPkgsCount: number;
  navigationStart: number;
  referrerPageId: number;
  referrerPath: string;
}

export default function observeEntries(reporter: PerformanceReporter) {
  const WEAPP = (globalThis as any).__Monitor_Framework__;

  try {
    const performanceObserver = WEAPP.getPerformance().createObserver(function (entryList: any) {
      entryList.getEntries().forEach((entry: IEntry) => {
        reporter({
          name: PERFORMANCE_NAME.NAVIGATION,
          metric: PERFORMANCE_METRIC.NAVIGATION,
          value: entry.duration,
          unit: PERFORMANCE_UNIT.MS,
          extras: entry,
        });
      });
    });

    performanceObserver.observe({ entryTypes: ['navigation'] });

    return () => {
      performanceObserver.disconnect();
    };
  } catch (error) {
    console.error('observeNavigation error', error);
  }
}
