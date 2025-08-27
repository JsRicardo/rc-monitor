import { onINP, INPMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { Reporter } from '../../types';

export function observeINP(reporter: Reporter) {
  onINP((metric: INPMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.INP,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
    });
  });
}
