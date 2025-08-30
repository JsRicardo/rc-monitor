import { onTTFB, TTFBMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export function observeTTFB(reporter: PerformanceReporter) {
  onTTFB((metric: TTFBMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.TTFB,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
      extras: metric,
    });
  });
}
