// 平台插件名称常量
export const PLUGIN_NAMES = {
  BROWSER_ERROR: 'browser-error',
  BROWSER_PERFORMANCE: 'browser-performance',
  WEAPP_ERROR: 'weapp-error',
  REACT_ERROR_BOUNDARY: 'react-error-boundary',
  VUE_ERROR_HANDLER: 'vue-error-handler',
  TARO_ERROR: 'taro-error',
  UNI_ERROR: 'uni-error',
} as const;

// 平台类型常量
export const PLATFORM_TYPES = {
  BROWSER: 'browser',
  WEAPP: 'weapp',
  REACT: 'react',
  VUE: 'vue',
  NODE: 'node',
  UNKNOWN: 'unknown',
} as const;

export type PlatformType = (typeof PLATFORM_TYPES)[keyof typeof PLATFORM_TYPES];

/**
 * 检测运行平台
 * @returns 平台标识符
 */
export function detectPlatform(): string {
  // 浏览器环境检测
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // 检测框架 - 使用更安全的方式
    if (typeof (window as any).React !== 'undefined') return PLATFORM_TYPES.REACT;
    if (typeof (window as any).Vue !== 'undefined') return PLATFORM_TYPES.VUE;
    return PLATFORM_TYPES.BROWSER;
  }

  // 微信小程序环境检测
  if (typeof (global as any).wx !== 'undefined' && (global as any).wx.getSystemInfo) {
    return PLATFORM_TYPES.WEAPP;
  }
  // Node.js环境检测
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return PLATFORM_TYPES.NODE;
  }

  return PLATFORM_TYPES.UNKNOWN;
}
