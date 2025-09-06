import { REPORT_TYPE } from '@rc-monitor/core';
import { createJsErrorData } from '@rc-monitor/utils';

import BasePlugin from '../../BasePlugin';
import { PLUGIN_NAMES } from '../../constant';
import { ErrorPluginOption, ErrorReporter } from '../../types';

function observeSyncError(reporter: ErrorReporter) {
  const WXApp = (globalThis as any).__Monitor__Framework__;
  if (!WXApp) {
    console.error(
      'WXApp instance not found, Make sure you are config frameworkInstance correctly.'
    );
    return;
  }

  const handler = (error: string | ErrorEvent | Error) => {
    const errorData = createJsErrorData(error as Error, REPORT_TYPE.JS_ERROR);
    reporter(errorData);
  };

  WXApp.onError(handler);
}

function observePromiseError(reporter: ErrorReporter) {
  const WXApp = (globalThis as any).__Monitor__Framework__;
  if (!WXApp) {
    console.error(
      'WXApp instance not found, Make sure you are config frameworkInstance correctly.'
    );
    return;
  }

  const handler = (error: PromiseRejectionEvent) => {
    const errorData = createJsErrorData(error.reason, REPORT_TYPE.PROMISE_REJECTION);
    reporter(errorData);
  };

  WXApp.onUnhandledRejection(handler);
}

export class WXAppErrorPlugin extends BasePlugin<ErrorPluginOption> {
  name = PLUGIN_NAMES.WEAPP_ERROR;

  protected reportType = REPORT_TYPE.WEAPP_ERROR;

  protected observerMap = new Map([
    [REPORT_TYPE.JS_ERROR, observeSyncError],
    [REPORT_TYPE.PROMISE_REJECTION, observePromiseError],
  ]);
}
