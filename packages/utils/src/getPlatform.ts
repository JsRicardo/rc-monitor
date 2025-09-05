// 平台类型常量
export const PLATFORM_TYPES = {
  BROWSER: 'browser',
  WEAPP: 'weapp',
  REACT: 'react',
  TARO: 'taro',
  UNI: 'uni',
  VUE: 'vue',
  UNKNOWN: 'unknown',
} as const;

export type PlatformType = (typeof PLATFORM_TYPES)[keyof typeof PLATFORM_TYPES];

/**
 * 检测运行平台
 * @returns 平台标识符
 */
export default function getPlatform(): PlatformType {
  // 浏览器环境检测
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Taro 检测
    if (typeof (window as any).__Monitor__Framework__?.ENV_TYPE !== 'undefined') {
      return PLATFORM_TYPES.TARO;
    }

    // Uni-app 检测
    if (typeof (window as any).uni !== 'undefined') {
      return PLATFORM_TYPES.UNI;
    }

    return PLATFORM_TYPES.BROWSER;
  }

  // Taro 环境检测 (非浏览器环境)
  if (typeof (globalThis as any).__Monitor__Framework__?.ENV_TYPE !== 'undefined') {
    return PLATFORM_TYPES.TARO;
  }

  // Uni-app 环境检测 (非浏览器环境)
  if (typeof (globalThis as any).uni !== 'undefined') {
    return PLATFORM_TYPES.UNI;
  }

  // 微信小程序环境检测
  if (typeof (globalThis as any).wx !== 'undefined' && (globalThis as any).wx.getSystemInfo) {
    return PLATFORM_TYPES.WEAPP;
  }

  return PLATFORM_TYPES.UNKNOWN;
}
