import { PERFORMANCE_NAME, PERFORMANCE_METRIC, PERFORMANCE_UNIT } from '../../constant';
import { PerformanceReporter } from '../../types';

interface IEntry {
  duration: number;
  entryType: 'script';
  fileList: string[];
  moduleName: string;
  name: string;
  startTime: number;
}

export default function observeEntries(reporter: PerformanceReporter) {
  const WEAPP = (globalThis as any).__Monitor_Framework__;

  try {
    const performanceObserver = WEAPP.getPerformance().createObserver(function (entryList: any) {
      entryList.getEntries().forEach((entry: IEntry) => {
        const { duration, entryType, fileList, moduleName, name, startTime } = entry;

        reporter({
          name: PERFORMANCE_NAME.ENTRIES,
          metric: PERFORMANCE_METRIC.RESOURCE,
          value: duration,
          unit: PERFORMANCE_UNIT.MS,
          extras: {
            entryType,
            fileList,
            moduleName,
            name,
            startTime,
          },
        });
      });
    });

    performanceObserver.observe({ entryTypes: ['script'] });
    return () => {
      performanceObserver.disconnect();
    };
  } catch (error) {
    console.error('observeScript error', error);
  }
}
