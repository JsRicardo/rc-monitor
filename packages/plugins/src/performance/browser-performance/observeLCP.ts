import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../types';

import type { Reporter } from '../../types';

export function observeLCP(reporter: Reporter) {
  if (!window?.PerformanceObserver) {
    return;
  }

  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      console.log(entry);
      if (entry.entryType === 'largest-contentful-paint') {
        observer.disconnect();
        reporter({
          metric: PERFORMANCE_METRIC.PAINT,
          name: PERFORMANCE_NAME.LCP,
          value: Math.round(entry.startTime),
          unit: PERFORMANCE_UNIT.MS,
        });
      }
    }
  });

  observer.observe({ entryTypes: ['paint'] });
}
