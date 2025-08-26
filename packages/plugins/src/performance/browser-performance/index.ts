import { Plugin, Monitor, REPORT_TYPE } from '@rc-monitor/core';
import { PLUGIN_NAMES } from '@rc-monitor/platform';
import {
  getPerformanceData,
  getAllPerformanceData,
  PerformanceName,
  PerformanceData,
} from '@rc-monitor/utils';

/**
 * 浏览器性能插件
 * 用于采集浏览器性能指标
 */
export class BrowserPerformancePlugin implements Plugin {
  name = PLUGIN_NAMES.BROWSER_PERFORMANCE;

  /**
   * 浏览器性能插件
   * @param metrics 性能指标
   * @param inspector 性能指标处理函数
   */
  constructor(
    private readonly metrics?: PerformanceName[],
    private readonly inspector?: <T>(data: PerformanceData) => T
  ) {}

  private async batchGetPerformanceData(): Promise<PerformanceData[]> {
    let res = [] as PerformanceData[];
    if (this.metrics?.length) {
      const promises = this.metrics.map(metric => getPerformanceData(metric));
      res = await Promise.all(promises);
    } else {
      res = await getAllPerformanceData();
    }

    return res;
  }

  async install(monitor: Monitor): Promise<void> {
    try {
      const performanceDataArray = await this.batchGetPerformanceData();
      performanceDataArray.forEach(pData => {
        const data = this.inspector?.(pData) || pData;
        monitor.report(REPORT_TYPE.PERFORMANCE, data);
      });
    } catch (error) {
      console.error('BrowserPerformancePlugin error', error);
    }
  }

  uninstall(): void {
    console.log('BrowserPerformancePlugin uninstall');
  }
}
