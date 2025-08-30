import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

function observeEvent(reporter: PerformanceReporter) {
  const observer = new PerformanceObserver(list => {
    const entries = list.getEntries();
    for (const entry of entries as PerformanceResourceTiming[]) {
      observer.disconnect();

      const reportData = {
        metric: PERFORMANCE_METRIC.RESOURCE,
        name: PERFORMANCE_NAME.ENTRIES,
        value: entry.duration,
        unit: PERFORMANCE_UNIT.MS,
        extras: {
          name: entry.name,
          sourceType: entry.initiatorType,
          startTime: entry.startTime,
          dns: entry.domainLookupEnd - entry.domainLookupStart, // 域名解析时间
          tcp: entry.connectEnd - entry.connectStart, // tcp连接时间
          redirect: entry.redirectEnd - entry.redirectStart, // 重定向时间
          ttfb: entry.responseStart, // 首字节实践
          responseBodySize: entry.encodedBodySize,
          responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头大小
          transferSize: entry.transferSize, // 传输大小
          resourceSize: entry.decodedBodySize, // 资源大小
          protocol: entry.nextHopProtocol,
        },
      };
      reporter(reportData);
    }
  });
  observer.observe({ type: 'resource', buffered: true });
}

export function observeEntries(reporter: PerformanceReporter) {
  if (document.readyState === 'complete') {
    observeEvent(reporter);
  } else {
    const onload = () => {
      observeEvent(reporter);
      window.removeEventListener('load', onload);
    };
    window.addEventListener('load', onload);
  }
}
