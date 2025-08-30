import { debounce } from 'lodash-es';

import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

const defaultBehavior = ['input', 'change'];

export default function onInput(reporter: UserBehaviorReporter) {
  const cleanupFunctions: Array<() => void> = [];

  defaultBehavior.forEach(item => {
    // 输入事件处理时 应该注意同一个输入事件不要多次上报 使用debounce处理
    const handler = debounce((e: Event) => {
      const elementTarget = e.target instanceof HTMLInputElement ? e.target : null;

      reporter({
        action: USER_BEHAVIOR_ACTION.INPUT,
        url: window.location.href,
        timestamp: Date.now(),
        eventType: e.type,
        element: elementTarget?.tagName.toLowerCase() || 'unknown',
        extras: {
          value: elementTarget?.value,
          outerHTML: elementTarget?.outerHTML,
          targetTagName: elementTarget?.tagName?.toLowerCase() || '',
          targetId: elementTarget?.id || '',
          targetClass: elementTarget?.classList?.value || '',
        },
      });
    }, 300);

    window.addEventListener(item, handler);
    cleanupFunctions.push(() => {
      window.removeEventListener(item, handler);
    });
  });

  return () => {
    cleanupFunctions.forEach(fn => fn());
  };
}
