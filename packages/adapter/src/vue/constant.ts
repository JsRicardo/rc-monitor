import { Monitor } from '@rc-monitor/core';
import { InjectionKey } from 'vue';

export const DEFAULT_MONITOR_INJECT_KEY: InjectionKey<Monitor> = Symbol.for('monitor');
