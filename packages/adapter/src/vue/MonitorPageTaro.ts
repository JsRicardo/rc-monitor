import { Monitor } from '@rc-monitor/core';
import { defineComponent, h } from 'vue';

export default function MonitorPage(monitor: Monitor, interceptor?: (data: any) => any) {
  return /*#__PURE__*/ defineComponent((props, { slots }) => {
    const handleTap = (e: any) => {
      const resp = {
        action: 'click',
        timestamp: Date.now(),
        eventType: e?.type,
        element: e?.mpEvent?.target?.id || 'unknown',
        extras: {
          x: e?.detail?.x,
          y: e?.detail?.y,
        },
      };

      const data = interceptor?.(resp) || resp;
      monitor.report('user-behavior', data);
    };

    return () => {
      return h(
        'view',
        {
          onTap: handleTap,
          class: 'with-monitor-wrapper',
        },
        [slots.default?.()]
      );
    };
  });
}
