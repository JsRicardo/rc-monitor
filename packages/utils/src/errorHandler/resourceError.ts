import { ERROR_TYPE_METRIC, RCErrorData } from '../types';

export function createResourceErrorData(errTarget: Record<string, any>): RCErrorData {
  const url = errTarget.src || errTarget.href;

  return {
    uuid: `uuid-${errTarget.localName}-${url}`,
    message: 'resource load error',
    errorType: ERROR_TYPE_METRIC.RESOURCE_ERROR,
    subErrorType: errTarget.localName,
    url,
  };
}
