import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

/**
 * SPA页面变化监控
 */
export default function onPageChange(reporter: UserBehaviorReporter) {
  // 保存当前URL
  let currentUrl = window.location.href;
  let currentTitle = document.title;

  // 检测页面变化的函数
  const checkPageChange = () => {
    const newUrl = window.location.href;
    const newTitle = document.title;

    // 如果URL或标题发生变化，触发页面变化事件
    if (newUrl !== currentUrl || newTitle !== currentTitle) {
      reporter({
        action: USER_BEHAVIOR_ACTION.PAGE_CHANGE,
        url: newUrl,
        timestamp: Date.now(),
        eventType: 'spaNavigation',
        element: 'body',
        extras: {
          fromUrl: currentUrl,
          fromTitle: currentTitle,
          toUrl: newUrl,
          toTitle: newTitle,
          referrer: document.referrer,
        },
      });

      // 更新当前URL和标题
      currentUrl = newUrl;
      currentTitle = newTitle;
    }
  };

  // 使用popstate事件监听浏览器前进后退
  window.addEventListener('popstate', checkPageChange);

  // 监听hashchange事
  window.addEventListener('hashchange', checkPageChange);

  // 返回清理函数
  return () => {
    window.removeEventListener('popstate', checkPageChange);
    window.removeEventListener('hashchange', checkPageChange);
  };
}
