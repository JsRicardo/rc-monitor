/**
 * 类型定义文件
 * 包含所有公共接口和类型定义
 */

import { REPORT_TYPE, REPORTER_TYPE } from './constant';
import { Monitor } from './monitor';

export type ReporterType = (typeof REPORTER_TYPE)[keyof typeof REPORTER_TYPE];

export interface MonitorConfig {
  /** 数据上报地址 */
  endpoint: string;
  /** 应用ID */
  appId: string;
  /** 采样率  */
  sampleRate?: number;
  /** 上报方案 img sendBeacon xhr fetch*/
  reporterType: ReporterType;
  /** 自定义上报方法 */
  reportFunction?: (data: ReportData[]) => void;
  /** 上报间隔（毫秒） */
  reportInterval?: number;
  /** 最大缓存数据条数 */
  maxCacheSize?: number;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 数据格式自定义函数 */
  inspector?: <T>(type: string, data: any) => T;
  /** 限制错误重试次数 */
  retryMax?: number;
  /** 上报接口配置 */
  reportOptions?: { timeout: number; headers: Record<string, string>; [key: string]: any };
}

export interface Plugin {
  /** 插件名称 */
  name: string;
  /** 插件安装方法 */
  install(monitor: Monitor): void;
  /** 插件卸载方法 */
  uninstall?(): void;
}

export interface ReportData {
  /** 数据类型 */
  type: string;
  /** 数据唯一ID */
  uuid?: string;
  /** 数据内容 */
  data: any;
  /** 时间戳 */
  timestamp: number;
  /** 应用ID */
  appId: string;
}

export interface ReportService {
  /** 发送数据到服务器 */
  sendData(data: ReportData[]): Promise<void>;
}

export interface PluginManager {
  /** 安装插件 */
  use(plugin: Plugin): void;
  /** 卸载插件 */
  unuse(pluginName: string): void;
  /** 卸载所有插件 */
  unuseAllPlugin(): void;
}

export type ReportType = (typeof REPORT_TYPE)[keyof typeof REPORT_TYPE];
