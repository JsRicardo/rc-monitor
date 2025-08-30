import { onCLS, CLSMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export function observeCLS(reporter: PerformanceReporter) {
  onCLS((metric: CLSMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.CLS,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
      extras: metric,
    });
  });
}
