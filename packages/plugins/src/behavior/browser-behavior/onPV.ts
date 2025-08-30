import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

/**
 * 生成页面唯一标识
 * @returns 页面ID字符串
 */
function generatePageId(): string {
  const url = window.location.href;
  const timestamp = Date.now();
  return `${url}-${timestamp}`;
}

export default function onPV(reporter: UserBehaviorReporter) {
  // 页面加载完成后触发PV事件
  const handlePageLoad = () => {
    reporter({
      action: USER_BEHAVIOR_ACTION.PV,
      url: window.location.href,
      timestamp: Date.now(),
      eventType: 'pageLoad',
      element: 'body',
      extras: {
        pageId: generatePageId(),
        title: document.title,
        referrer: document.referrer,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        // 可以添加更多页面相关信息
      },
    });
  };

  // 检查页面是否已经加载完成
  if (document.readyState === 'complete') {
    handlePageLoad();
  } else {
    window.addEventListener('load', handlePageLoad);
  }

  // 返回清理函数
  return () => {
    window.removeEventListener('load', handlePageLoad);
  };
}
