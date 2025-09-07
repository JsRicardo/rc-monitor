import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export default function observeRequest(reporter: PerformanceReporter) {
  const Taro = (globalThis as any).__Monitor_Framework__;

  try {
    Taro.addInterceptor((chain: any) => {
      const time = Date.now();

      const requestParams = chain.requestParams;
      const { method, data, url } = requestParams;

      let duration = 0,
        status = 'success';

      chain
        .proceed(requestParams)
        .then(() => {
          duration = Date.now() - time;
          status = 'success';
        })
        .catch(() => {
          duration = Date.now() - time;
          status = 'fail';
        });

      const requestPerformance = {
        name: PERFORMANCE_NAME.REQUEST,
        metric: PERFORMANCE_METRIC.REQUEST,
        unit: PERFORMANCE_UNIT.MS,
        value: duration,
        extra: {
          method,
          data,
          url,
          status,
        },
      };

      reporter(requestPerformance);
    });
  } catch (error) {
    console.error('observeRequest error', error);
  }
}
