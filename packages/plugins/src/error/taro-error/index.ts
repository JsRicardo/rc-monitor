import { REPORT_TYPE } from '@rc-monitor/core';
import { createJsErrorData } from '@rc-monitor/utils';

import BasePlugin from '../../BasePlugin';
import { PLUGIN_NAMES } from '../../constant';
import { ErrorPluginOption, ErrorReporter } from '../../types';

function observeSyncError(reporter: ErrorReporter) {
  const Taro = (globalThis as any).__Monitor__Framework__;
  if (!Taro) {
    console.error('Taro instance not found, Make sure you are config frameworkInstance correctly.');
    return;
  }

  const handler = (error: string | ErrorEvent | Error) => {
    const errorData = createJsErrorData(error as Error, REPORT_TYPE.JS_ERROR);
    reporter(errorData);
  };

  Taro.onError(handler);
}

function observePromiseError(reporter: ErrorReporter) {
  const Taro = (globalThis as any).__Monitor__Framework__;
  if (!Taro) {
    console.error('Taro instance not found, Make sure you are config frameworkInstance correctly.');
    return;
  }

  const handler = (error: PromiseRejectionEvent) => {
    const errorData = createJsErrorData(error.reason, REPORT_TYPE.PROMISE_REJECTION);
    reporter(errorData);
  };

  Taro.onUnhandledRejection(handler);
}

export class TaroErrorPlugin extends BasePlugin<ErrorPluginOption> {
  name = PLUGIN_NAMES.TARO_ERROR;
  protected reportType = REPORT_TYPE.TARO_ERROR;

  protected observerMap = new Map([
    [REPORT_TYPE.JS_ERROR, observeSyncError],
    [REPORT_TYPE.PROMISE_REJECTION, observePromiseError],
  ]);
}
