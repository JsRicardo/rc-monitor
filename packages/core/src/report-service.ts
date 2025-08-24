/**
 * 数据上报服务
 * 负责数据发送到服务器的具体实现
 */

import { ReportService, ReportData } from './types';

export class FetchReportService implements ReportService {
  /** 上报地址 */
  private endpoint: string;
  /** 应用ID */
  private appId: string;

  /**
   * 创建数据上报服务实例
   * @param endpoint 上报地址
   * @param appId 应用ID
   */
  constructor(endpoint: string, appId: string) {
    this.endpoint = endpoint;
    this.appId = appId;
  }

  /**
   * 发送数据到服务器
   * @param data 要上报的数据数组
   */
  async sendData(data: ReportData[]): Promise<void> {
    if (data.length === 0) {
      return;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: this.appId,
          data: data,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to send data: ${error}`);
    }
  }
}
