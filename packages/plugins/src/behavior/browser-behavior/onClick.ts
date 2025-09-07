import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

const defaultBehavior = ['click', 'touchstart'];

export default function onClick(reporter: UserBehaviorReporter) {
  // 存储所有的事件监听器
  const cleanupFunctions: Array<() => void> = [];

  defaultBehavior.forEach(item => {
    const handleClick = (e: Event) => {
      const elementTarget = e.target instanceof Element ? e.target : null;
      reporter({
        action: USER_BEHAVIOR_ACTION.CLICK,
        url: window.location.href,
        timestamp: Date.now(),
        eventType: e.type,
        element: elementTarget?.tagName?.toLowerCase() || 'unknown',
        extras: {
          // 提取事件对象的关键信息，避免直接传递整个事件对象
          x: 'clientX' in e ? (e as MouseEvent).clientX : 0,
          y: 'clientY' in e ? (e as MouseEvent).clientY : 0,
          outerHTML: elementTarget?.outerHTML,
          targetTagName: elementTarget?.tagName?.toLowerCase() || '',
          targetId: elementTarget?.id || '',
          targetClass: elementTarget?.classList?.value || '',
        },
      });
    };

    window.addEventListener(item, handleClick);
    cleanupFunctions.push(() => {
      window.removeEventListener(item, handleClick);
    });
  });

  // 返回清理函数
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}
