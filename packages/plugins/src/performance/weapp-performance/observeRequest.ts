import { PERFORMANCE_METRIC, PERFORMANCE_NAME, PERFORMANCE_UNIT } from '../../constant';

import type { PerformanceReporter } from '../../types';

export default function observeRequest(reporter: PerformanceReporter) {
  const WEAPP = (globalThis as any).__Monitor_Framework__;

  // 保存原始的wx.request方法
  const originalRequest = WEAPP?.request || (globalThis as any).wx?.request;

  if (!originalRequest) {
    console.error(
      'WEAPP instance not found, Make sure you are config frameworkInstance correctly.'
    );
    return () => {};
  }

  // 重写wx.request方法
  const wrappedRequest = function (options: any) {
    // 生成请求唯一标识
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 记录请求开始时间
    const startTime = Date.now();
    const url = options.url || '';
    const method = (options.method || 'GET').toUpperCase();

    // 保存原始的回调函数
    const originalSuccess = options.success;
    const originalFail = options.fail;
    const originalComplete = options.complete;

    // 标记请求是否已经完成上报
    let isReported = false;

    // 创建统一的上报函数
    const reportPerformance = (isSuccess: boolean, extraData: any) => {
      if (isReported) return;
      isReported = true;

      const endTime = Date.now();
      const duration = endTime - startTime;

      reporter({
        metric: PERFORMANCE_METRIC.REQUEST,
        name: PERFORMANCE_NAME.REQUEST,
        value: duration,
        unit: PERFORMANCE_UNIT.MS,
        extras: {
          url,
          method,
          requestId,
          success: isSuccess,
          startTime,
          endTime,
          ...extraData,
        },
      });
    };

    options.success = function (res: any) {
      reportPerformance(true, {
        statusCode: res.statusCode,
      });

      if (typeof originalSuccess === 'function') {
        originalSuccess(res);
      }
    };

    options.fail = function (err: any) {
      reportPerformance(false, {
        error: err?.errMsg || 'Unknown error',
      });

      if (typeof originalFail === 'function') {
        originalFail(err);
      }
    };

    options.complete = function (res: any) {
      if (!isReported) {
        const isSuccess = res?.statusCode >= 200 && res?.statusCode < 400;
        reportPerformance(isSuccess, {
          statusCode: res?.statusCode,
          error: res?.errMsg,
        });
      }

      if (typeof originalComplete === 'function') {
        originalComplete(res);
      }
    };

    return originalRequest(options);
  };

  if (WEAPP) {
    WEAPP.request = wrappedRequest;
  } else if ((globalThis as any).wx) {
    (globalThis as any).wx.request = wrappedRequest;
  }

  return () => {
    if (WEAPP) {
      WEAPP.request = originalRequest;
    } else if ((globalThis as any).wx) {
      (globalThis as any).wx.request = originalRequest;
    }
  };
}
