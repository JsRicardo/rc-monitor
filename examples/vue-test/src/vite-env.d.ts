/// <reference types="vite/client" />

import type { Monitor } from '@rc-monitor/rc-monitor';

declare module 'vue' {
  interface ComponentCustomProperties {
    $monitor: Monitor | undefined;
  }
}
