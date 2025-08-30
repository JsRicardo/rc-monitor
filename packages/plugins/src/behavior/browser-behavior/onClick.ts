import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

const defaultBehavior = ['click', 'touchstart'];

export default function onClick(reporter: UserBehaviorReporter) {
  // 存储所有的事件监听器
  const cleanupFunctions: Array<() => void> = [];

  defaultBehavior.forEach(item => {
    const handleClick = (e: Event) => {
      reporter({
        action: USER_BEHAVIOR_ACTION.CLICK,
        url: window.location.href,
        timestamp: Date.now(),
        eventType: e.type,
        element: e.target,
        extras: {
          // 提取事件对象的关键信息，避免直接传递整个事件对象
          x: 'clientX' in e ? (e as MouseEvent).clientX : 0,
          y: 'clientY' in e ? (e as MouseEvent).clientY : 0,
          targetTagName: e.target instanceof Element ? e.target.tagName.toLowerCase() : '',
          targetId: e.target instanceof Element ? e.target.id : '',
          targetClass: e.target instanceof Element ? Array.from(e.target.classList).join(' ') : '',
          // 可以根据需要添加更多有用的信息
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
