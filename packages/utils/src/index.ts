import { parseError, createJsErrorData, isPromiseRejection, createErrorUuid } from './errorHandler';
import getPlatform, { PLATFORM_TYPES, type PlatformType } from './getPlatform';
import {
  imageSender,
  fetchSender,
  sendBeaconSender,
  xhrSender,
  type SenderOptions,
} from './reportSender';

import type { JsErrorData, ParsedError, RcErrorType } from './types';

export {
  JsErrorData,
  ParsedError,
  RcErrorType,
  SenderOptions,
  PlatformType,
  PLATFORM_TYPES,
  isPromiseRejection,
  createErrorUuid,
  parseError,
  createJsErrorData,
  getPlatform,
  imageSender,
  fetchSender,
  sendBeaconSender,
  xhrSender,
};
