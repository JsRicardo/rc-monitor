/**
 * rc-monitor SDK - * 统一导出入口
 * 导出所有外部需要的功能
 */

// 适配器模块导入 - 值
import { Vue3Adapter, ReactAdapter, useRCMonitor } from '@rc-monitor/adapter';
// 核心模块导入 - 值
import { Monitor, DataQueue, REPORT_TYPE, REPORTER_TYPE } from '@rc-monitor/core';

// 适配器模块导入 - 类型
import type {
  VueAdapterOptions,
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@rc-monitor/adapter';
// 核心模块导入 - 类型
import type { MonitorConfig, Plugin, ReportData, ReportType, ReporterType } from '@rc-monitor/core';

// 统一导出
export {
  // 适配器
  Vue3Adapter,
  useRCMonitor,
  ReactAdapter,

  // 适配器类型
  VueAdapterOptions,
  ErrorBoundaryProps,
  ErrorBoundaryState,

  // 核心类
  Monitor,
  DataQueue,
  REPORT_TYPE,
  REPORTER_TYPE,

  // 核心类型
  MonitorConfig,
  Plugin,
  ReportData,
  ReportType,
  ReporterType,
};
