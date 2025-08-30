import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export function observeLoad(reporter: PerformanceReporter) {
  window.addEventListener(
    'load',
    event => {
      requestAnimationFrame(() => {
        reporter({
          metric: PERFORMANCE_METRIC.RESOURCE,
          name: PERFORMANCE_NAME.LOAD,
          value: performance.now() - event.timeStamp,
          unit: PERFORMANCE_UNIT.MS,
          extras: event,
        });
      });
    },
    true
  );
}
