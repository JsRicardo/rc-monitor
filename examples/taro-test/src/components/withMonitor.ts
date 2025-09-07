import { defineComponent, h } from 'vue';
import { useRCMonitor } from '@rc-monitor/rc-monitor';

// 使用defineComponent创建组件
export default /*#__PURE__*/ defineComponent((props, { slots }) => {
  const monitor = useRCMonitor();

  const handleTap = (e: any, v) => {
    console.error('🚀 ~ withMonitor.ts:26 ~ handleTap ~ e:', e, v);
    monitor.report('user-behavior', { type: 'click', target: 'withMonitor' });
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
