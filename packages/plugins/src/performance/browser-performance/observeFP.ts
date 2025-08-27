import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { Reporter } from '../../types';

export function observeFP(reporter: Reporter) {
  if (!window?.PerformanceObserver) {
    return;
  }

  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'first-paint') {
        observer.disconnect();
        reporter({
          metric: PERFORMANCE_METRIC.PAINT,
          name: PERFORMANCE_NAME.FP,
          value: Math.round(entry.startTime),
          unit: PERFORMANCE_UNIT.MS,
        });
      }
    }
  });

  observer.observe({ type: 'paint', buffered: true });
}
