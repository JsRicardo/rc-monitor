import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import { getPerformanceData, getAllPerformanceData, PerformanceName } from '@rc-monitor/utils';

import { performanceResults } from '../../types';

/**
 * 浏览器性能插件
 * 用于采集浏览器性能指标
 */
export class WeappPerformancePlugin implements Plugin {
  name = PLUGIN_NAMES.BROWSER_PERFORMANCE;

  /**
   * 浏览器性能插件
   * @param metrics 性能指标
   * @param inspector 性能指标处理函数
   */
  constructor(
    private readonly metrics?: PerformanceName[],
    private readonly inspector?: <T>(data: performanceResults) => T
  ) {}

  private async batchGetPerformanceData() {
    let performanceData: performanceResults = {} as performanceResults;
    if (this.metrics?.length) {
      for (const metric of this.metrics) {
        performanceData[metric] = await getPerformanceData(metric);
      }
    } else {
      performanceData = await getAllPerformanceData();
    }

    return performanceData;
  }

  async install(monitor: Monitor): Promise<void> {
    try {
      const pData = await this.batchGetPerformanceData();
      const data = this.inspector?.(pData) || pData;
      monitor.report(REPORT_TYPE.PERFORMANCE, data);
    } catch (error) {
      console.error('BrowserPerformancePlugin error', error);
    }
  }

  uninstall(): void {
    console.log('BrowserPerformancePlugin uninstall');
  }
}
