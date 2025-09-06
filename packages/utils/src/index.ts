import createLogger from './createLogger';
import { createJsErrorData, createErrorUuid } from './errorHandler/index';
import getPlatform, { PLATFORM_TYPES, type PlatformType } from './getPlatform';
import {
  imageSender,
  fetchSender,
  sendBeaconSender,
  xhrSender,
  type SenderOptions,
} from './reportSender';
import { ERROR_TYPE_METRIC, SUB_ERROR_TYPE_METRIC } from './types';

import type { ErrorTypeMetric, SubErrorTypeMetric, RCErrorData } from './types';

export {
  createJsErrorData,
  createErrorUuid,
  RCErrorData,
  ErrorTypeMetric,
  SubErrorTypeMetric,
  ERROR_TYPE_METRIC,
  SUB_ERROR_TYPE_METRIC,
  SenderOptions,
  PlatformType,
  PLATFORM_TYPES,
  getPlatform,
  imageSender,
  fetchSender,
  sendBeaconSender,
  xhrSender,
  createLogger,
};
