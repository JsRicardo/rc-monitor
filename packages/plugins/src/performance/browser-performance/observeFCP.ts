import { onFCP, FCPMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { Reporter } from '../../types';

export function observeFCP(reporter: Reporter) {
  onFCP((metric: FCPMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.FCP,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
    });
  });
}
