import { BrowserBehaviorPlugin, TaroBehaviorPlugin } from './behavior';
import { BrowserErrorPlugin, WXAppErrorPlugin, TaroErrorPlugin, UniErrorPlugin } from './error';
import { BrowserPerformancePlugin, WeappPerformancePlugin } from './performance';

/**
 * 监控插件集合
 * 提供错误、性能、用户行为等多种监控功能
 */
export {
  // 错误监控插件
  BrowserErrorPlugin,
  WXAppErrorPlugin,
  TaroErrorPlugin,
  UniErrorPlugin,

  // 性能监控插件
  BrowserPerformancePlugin,
  WeappPerformancePlugin,

  // 用户行为监控插件
  BrowserBehaviorPlugin,
  TaroBehaviorPlugin,
};
