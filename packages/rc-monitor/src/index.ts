/**
 * rc-monitor SDK - * 统一导出入口
 * 导出所有外部需要的功能
 */

// 适配器模块导入 - 值
import { Vue3Adapter, ReactAdapter } from '@rc-monitor/adapter';
// 核心模块导入 - 值
import { Monitor, DataQueue, REPORT_TYPE, REPORTER_TYPE } from '@rc-monitor/core';
// 平台相关导入 - 值
import { detectPlatform, PLUGIN_NAMES, PLATFORM_TYPES } from '@rc-monitor/platform';

// 适配器模块导入 - 类型
import type {
  Vue3AdapterInstance,
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from '@rc-monitor/adapter';
// 核心模块导入 - 类型
import type { MonitorConfig, Plugin, ReportData, ReportType, ReporterType } from '@rc-monitor/core';
// 平台相关导入 - 类型
import type { PlatformType } from '@rc-monitor/platform';

// 统一导出
export {
  // 适配器
  Vue3Adapter,
  ReactAdapter,

  // 适配器类型
  Vue3AdapterInstance,
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

  // 平台相关
  PLUGIN_NAMES,
  PLATFORM_TYPES,
  detectPlatform,
  PlatformType,
};
