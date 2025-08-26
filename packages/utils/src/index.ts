import { parseError, createJsErrorData, isPromiseRejection } from './errorHandler';
import { getPerformanceData, getAllPerformanceData } from './performanceHandler';

import type { JsErrorData, ParsedError, PerformanceData, PerformanceName } from './types';

export {
  JsErrorData,
  ParsedError,
  PerformanceData,
  PerformanceName,
  isPromiseRejection,
  parseError,
  createJsErrorData,
  getPerformanceData,
  getAllPerformanceData,
};
