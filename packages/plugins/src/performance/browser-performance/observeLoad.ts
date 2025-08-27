import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { Reporter } from '../../types';

export function observeLoad(reporter: Reporter) {
  window.addEventListener(
    'load',
    event => {
      requestAnimationFrame(() => {
        reporter({
          metric: PERFORMANCE_METRIC.RESOURCE,
          name: PERFORMANCE_NAME.LOAD,
          value: performance.now() - event.timeStamp,
          unit: PERFORMANCE_UNIT.MS,
        });
      });
    },
    true
  );
}
