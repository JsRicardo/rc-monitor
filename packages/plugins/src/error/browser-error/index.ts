import { REPORT_TYPE } from '@rc-monitor/core';
import { createJsErrorData, ERROR_TYPE_METRIC } from '@rc-monitor/utils';

import BasePlugin from '../../BasePlugin';
import { PLUGIN_NAMES } from '../../constant';
import { ErrorPluginOption, ErrorReporter } from '../../types';

function observeJsError(reporter: ErrorReporter) {
  const handler = (event: ErrorEvent) => {
    if (event) {
      const errorData = createJsErrorData(event.error, REPORT_TYPE.JS_ERROR);
      reporter(errorData);
    }
  };

  window.addEventListener('error', handler, true);

  return () => {
    window.removeEventListener('error', handler, true);
  };
}

function ObservePromiseError(reporter: ErrorReporter) {
  const handler = (event: PromiseRejectionEvent) => {
    if (event) {
      const errorData = createJsErrorData(event.reason, REPORT_TYPE.PROMISE_REJECTION);
      reporter(errorData);
    }
  };

  window.addEventListener('unhandledrejection', handler);

  return () => {
    window.removeEventListener('unhandledrejection', handler);
  };
}

export class BrowserErrorPlugin extends BasePlugin<ErrorPluginOption> {
  name = PLUGIN_NAMES.BROWSER_ERROR;
  protected reportType = REPORT_TYPE.JS_ERROR;

  protected readonly observerMap = new Map([
    [ERROR_TYPE_METRIC.JS_ERROR, observeJsError],
    [ERROR_TYPE_METRIC.PROMISE_REJECTION, ObservePromiseError],
  ]);
}
