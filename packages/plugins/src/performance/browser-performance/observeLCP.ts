import { onLCP, LCPMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export function observeLCP(reporter: PerformanceReporter) {
  onLCP((metric: LCPMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.LCP,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
      extras: metric,
    });
  });
}
