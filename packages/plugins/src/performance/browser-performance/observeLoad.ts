import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export function observeLoad(reporter: PerformanceReporter) {
  const eventHandler = (event: Event) => {
    requestAnimationFrame(() => {
      reporter({
        metric: PERFORMANCE_METRIC.RESOURCE,
        name: PERFORMANCE_NAME.LOAD,
        value: performance.now() - event.timeStamp,
        unit: PERFORMANCE_UNIT.MS,
        extras: event,
      });
    });
  };

  window.addEventListener('load', eventHandler, true);

  return () => {
    window.removeEventListener('load', eventHandler, true);
  };
}
