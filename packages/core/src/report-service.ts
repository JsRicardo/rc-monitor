/**
 * 数据上报服务
 * 负责数据发送到服务器的具体实现
 */
import { fetchSender, xhrSender, sendBeaconSender, imageSender } from '@rc-monitor/utils';

import { REPORTER_TYPE } from './constant';

import type { ReportService, ReportData, MonitorConfig, ReporterType } from './types';

export class FetchReportService implements ReportService {
  private readonly reporterTypeMap = new Map<
    ReporterType,
    (url: string, data: Record<string, any>, options?: any) => void
  >([
    [REPORTER_TYPE.FETCH, fetchSender],
    [REPORTER_TYPE.XHR, xhrSender],
    [REPORTER_TYPE.SEND_BEACON, sendBeaconSender],
    [REPORTER_TYPE.IMAGE, imageSender],
  ]);

  constructor(private readonly config: MonitorConfig) {}

  /**
   * 发送数据到服务器
   * @param data 要上报的数据数组
   */
  async sendData(data: ReportData[]): Promise<void> {
    if (!this.config.endpoint) {
      console.error('No endpoint provided for report service');
      return;
    }
    if (data.length === 0) return;

    try {
      const reporter = this.reporterTypeMap.get(this.config.reporterType || 'fetch');
      if (reporter) {
        reporter(this.config.endpoint, data, this.config.reportOptions);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
}
