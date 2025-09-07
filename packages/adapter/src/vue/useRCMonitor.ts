import { Monitor } from '@rc-monitor/core';
import { inject, InjectionKey } from 'vue';

import { DEFAULT_MONITOR_INJECT_KEY } from './constant';

/**
 * 获取monitor实例方法
 * @returns monitor实例
 */
export default function useRCMonitor(monitorInjectKey?: InjectionKey<Monitor>) {
  const monitor = inject(monitorInjectKey || DEFAULT_MONITOR_INJECT_KEY);
  if (!monitor) {
    throw new Error('monitor is not provided，please check the adapter options');
  }
  return monitor;
}
