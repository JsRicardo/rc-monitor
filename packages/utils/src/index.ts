import { parseError, createJsErrorData, isPromiseRejection } from './errorHandler';
import { getPerformanceData, getAllPerformanceData } from './performanceHandler';
import { PERFORMANCE_METRIC, PERFORMANCE_UNIT, PERFORMANCE_NAME } from './types';

import type {
  JsErrorData,
  ParsedError,
  PerformanceData,
  PerformanceName,
  PerformanceMetric,
  PerformanceUnit,
  PerformanceErrorType,
} from './types';

export {
  JsErrorData,
  ParsedError,
  PerformanceData,
  PerformanceName,
  PerformanceMetric,
  PerformanceUnit,
  PerformanceErrorType,
  PERFORMANCE_NAME,
  PERFORMANCE_METRIC,
  PERFORMANCE_UNIT,
  isPromiseRejection,
  parseError,
  createJsErrorData,
  getPerformanceData,
  getAllPerformanceData,
};
