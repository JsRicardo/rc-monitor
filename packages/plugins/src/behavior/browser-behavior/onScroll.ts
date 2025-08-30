import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

export default function onScroll(reporter: UserBehaviorReporter) {
  // 滚动事件频率控制
  let scrollTimer: number | null = null;
  const throttleTime = 1000; // 1秒节流
  const handler = (e: Event) => {
    // 使用节流避免频繁触发
    if (!scrollTimer) {
      scrollTimer = window.setTimeout(() => {
        reporter({
          action: USER_BEHAVIOR_ACTION.SCROLL,
          url: window.location.href,
          timestamp: Date.now(),
          eventType: e.type,
          element: e.target,
          extras: {
            ...e,
            scrollTop: window.scrollY || document.documentElement.scrollTop,
            scrollLeft: window.scrollX || document.documentElement.scrollLeft,
            scrollHeight: document.documentElement.scrollHeight,
            clientHeight: document.documentElement.clientHeight,
            scrollPercentage: Math.round(
              ((window.scrollY || document.documentElement.scrollTop) /
                (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
                100
            ),
          },
        });
        scrollTimer = null;
      }, throttleTime);
    }
  };
  window.addEventListener('scroll', handler);

  return () => {
    window.removeEventListener('scroll', handler);
  };
}
