import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../types';

import type { Reporter } from '../../types';

export function observeINP(reporter: Reporter) {
  if (!window?.PerformanceObserver) {
    return;
  }

  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'interaction') {
        console.log('Interaction:', entry);
        observer.disconnect();
        reporter({
          metric: PERFORMANCE_METRIC.PAINT,
          name: PERFORMANCE_NAME.INP,
          value: Math.round(entry.startTime),
          unit: PERFORMANCE_UNIT.MS,
        });
      }
    }
  });

  observer.observe({ type: 'interaction', buffered: true });
}
