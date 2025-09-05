import { USER_BEHAVIOR_ACTION } from '../../constant';
import { UserBehaviorReporter } from '../../types';

/**
 * 生成页面唯一标识
 * @returns 页面ID字符串
 */
function generatePageId(route: string): string {
  const timestamp = Date.now();
  return `${route}-${timestamp}`;
}

export default function onPV(reporter: UserBehaviorReporter) {
  // 从全局对象获取 Taro 实例
  const Taro = (global as any).__Monitor__Framework__;

  if (!Taro) {
    console.error('Taro instance not found, Make sure you are config frameworkInstance correctly.');
    return () => {};
  }

  // 监听App显示事件
  const handleAppShow = (res: any) => {
    try {
      let systemInfo = Taro.getSystemInfoSync?.() || {};
      const currentPageInfo = Taro.getCurrentPages?.()?.router || {};

      reporter({
        action: USER_BEHAVIOR_ACTION.PV,
        url: currentPageInfo.path || 'unknown',
        timestamp: Date.now(),
        eventType: 'pageLoad',
        element: 'app',
        extras: {
          pageId: generatePageId(currentPageInfo.path || 'unknown'),
          screenWidth: systemInfo.windowWidth || 0,
          screenHeight: systemInfo.windowHeight || 0,
          platform: systemInfo.platform || '',
          pageData: currentPageInfo.params || {},
          scene: res.scene,
        },
      });
    } catch (error) {
      console.error('Error in PV tracking:', error);
    }
  };

  // 添加App显示事件监听
  if (typeof Taro.onAppShow === 'function') {
    Taro.onAppShow(handleAppShow);
  }

  // 返回清理函数，移除事件监听
  return () => {
    if (typeof Taro.offAppShow === 'function') {
      Taro.offAppShow(handleAppShow);
    }
  };
}
