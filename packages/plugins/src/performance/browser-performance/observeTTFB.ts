import { onTTFB, TTFBMetric } from 'web-vitals';

import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { Reporter } from '../../types';

export function observeTTFB(reporter: Reporter) {
  onTTFB((metric: TTFBMetric) => {
    reporter({
      metric: PERFORMANCE_METRIC.PAINT,
      name: PERFORMANCE_NAME.TTFB,
      value: Math.round(metric.value),
      unit: PERFORMANCE_UNIT.MS,
    });
  });
}
