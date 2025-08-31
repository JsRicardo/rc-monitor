import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { Monitor, Vue3Adapter } from '@rc-monitor/rc-monitor';
import {
  BrowserErrorPlugin,
  BrowserBehaviorPlugin,
  BrowserPerformancePlugin,
} from '@rc-monitor/plugins';

const monitor = Monitor.getMonitor({
  appId: '123',
  endpoint: 'http://localhost:3000',
  reporterType: 'xhr',
});
monitor.use(new BrowserErrorPlugin());
monitor.use(new BrowserBehaviorPlugin());
monitor.use(new BrowserPerformancePlugin());

const app = createApp(App);

// app.config.errorHandler = (err, instance, info) => {
//   console.log(err, instance, info);
// };

// app.use({
//   install(app) {
//     app.config.globalProperties.$monitor = monitor;
//   },
// });

Vue3Adapter(monitor, {
  provide: true,
  errorInspector: (data: any) => {
    console.log(data);
    return data;
  },
});

app.mount('#app');
