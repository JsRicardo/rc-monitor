import { Monitor, Vue3Adapter } from '@rc-monitor/rc-monitor';
import {
  BrowserErrorPlugin,
  BrowserBehaviorPlugin,
  BrowserPerformancePlugin,
} from '@rc-monitor/plugins';
import type { App } from 'vue';

const monitor = Monitor.getMonitor({
  appId: '123',
  endpoint: 'http://localhost:3000',
  reporterType: 'xhr',
});

monitor.use(new BrowserErrorPlugin());
monitor.use(new BrowserBehaviorPlugin(['input']));
monitor.use(new BrowserPerformancePlugin({ metrics: ['lcp', 'entries'] }));

export function createMonitor(app: App) {
  app.use(
    Vue3Adapter(monitor, {
      provide: true,
      errorInspector: (data: any) => {
        console.log(data);
        return data;
      },
    })
  );
}

export default monitor;
