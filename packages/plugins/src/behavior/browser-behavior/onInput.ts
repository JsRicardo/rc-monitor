import { USER_BEHAVIOR_ACTION } from '../../constant';

import type { UserBehaviorReporter } from '../../types';

const defaultBehavior = ['input', 'change'];

export default function onInput(reporter: UserBehaviorReporter) {
  const cleanupFunctions: Array<() => void> = [];

  defaultBehavior.forEach(item => {
    const handler = (e: Event) => {
      reporter({
        action: USER_BEHAVIOR_ACTION.INPUT,
        url: window.location.href,
        timestamp: Date.now(),
        eventType: e.type,
        element: e.target,
        extras: e,
      });
    };

    window.addEventListener(item, handler);
    cleanupFunctions.push(() => {
      window.removeEventListener(item, handler);
    });
  });

  return () => {
    cleanupFunctions.forEach(fn => fn());
  };
}
