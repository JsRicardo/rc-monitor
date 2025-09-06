import { REPORT_TYPE } from '@rc-monitor/core';

import BasePlugin from '../../BasePlugin';
import { PLUGIN_NAMES } from '../../constant';
import { PerformancePluginOption } from '../../types';

export class TaroPerformancePlugin extends BasePlugin<PerformancePluginOption> {
  name = PLUGIN_NAMES.TARO_PERFORMANCE;
  protected reportType = REPORT_TYPE.PERFORMANCE;
}
