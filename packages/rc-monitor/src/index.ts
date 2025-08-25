/**
 * rc-monitor SDK - 统一导出入口
 * 导出所有外部需要的功能
 */

// 核心模块导入 - 值
import {
  createLogger,
  DataQueue,
  DefaultPluginManager,
  FetchReportService,
  Monitor,
} from '@rc-monitor/core';
// 平台相关导入 - 值
import { detectPlatform, PLUGIN_NAMES, PLATFORM_TYPES } from '@rc-monitor/platform';
// 插件导入
import { BrowserErrorPlugin, WeappErrorPlugin, TaroErrorPlugin } from '@rc-monitor/plugins';
// 工具函数导入 - 值
import { isPromiseRejection, parseError } from '@rc-monitor/utils';

// 核心模块导入 - 类型
import type { MonitorConfig, Plugin, ReportData } from '@rc-monitor/core';
// 平台相关导入 - 类型
import type { PlatformType } from '@rc-monitor/platform';

// 统一导出
export {
  // 核心类
  Monitor,
  FetchReportService,
  DefaultPluginManager,

  // 核心类型
  MonitorConfig,
  Plugin,
  ReportData,

  // 工具函数
  createLogger,
  DataQueue,

  // 插件
  BrowserErrorPlugin,
  WeappErrorPlugin,
  TaroErrorPlugin,

  // 错误解析工具
  parseError,
  isPromiseRejection,

  // 平台相关
  PLUGIN_NAMES,
  PLATFORM_TYPES,
  detectPlatform,
  PlatformType,
};
