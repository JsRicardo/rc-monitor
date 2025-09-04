import Taro from '@tarojs/taro';

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
  // 处理页面显示事件
  const handleAppShow = () => {
    try {
      const currentPages = Taro.getCurrentPages();
      if (currentPages.length > 0) {
        const currentPage = currentPages[currentPages.length - 1];
        const systemInfo = Taro.getSystemInfoSync();

        reporter({
          action: USER_BEHAVIOR_ACTION.PV,
          url: currentPage.route || '',
          timestamp: Date.now(),
          eventType: 'pageLoad',
          element: 'app',
          extras: {
            pageId: generatePageId(currentPage.route || ''),
            title: currentPage?.$getAppWebviewTitle?.() || document.title || '',
            screenWidth: systemInfo.windowWidth || 0,
            screenHeight: systemInfo.windowHeight || 0,
            platform: systemInfo.platform || '',
            pageData: currentPage.data || {},
            // 可以添加更多页面相关信息
          },
        });
      }
    } catch (error) {
      console.error('Error in PV tracking:', error);
    }
  };

  // 监听App显示事件
  Taro.onAppShow(handleAppShow);

  // 立即执行一次以捕获当前页面
  handleAppShow();

  // 返回清理函数
  return () => {
    Taro.offAppShow(handleAppShow);
  };
}
