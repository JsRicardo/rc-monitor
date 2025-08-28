import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { Monitor } from '@rc-monitor/rc-monitor';
import { Vue3Adapter } from '@rc-monitor/adapter';

const monitor = Monitor.getMonitor({
  appId: '123',
  endpoint: 'http://localhost:3000',
  reporterType: 'xhr',
});
const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.log(err, instance, info);
};

app.use(Vue3Adapter(monitor));
app.mount('#app');
