import { onFCP, FCPMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export function observeFCP(reporter: PerformanceReporter) {
  onFCP((metric: FCPMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.FCP,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
      extras: metric,
    });
  });
}
