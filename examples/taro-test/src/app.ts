import { createApp } from 'vue';

import './app.less';
import { Monitor } from '@rc-monitor/rc-monitor';
import { TaroErrorPlugin } from '@rc-monitor/plugins';
import Taro from '@tarojs/taro';

const monitor = Monitor.getMonitor({
  appId: '123',
  endpoint: 'http://localhost:3000',
  reporterType: 'xhr',
  frameworkInstance: Taro,
});

monitor.use(new TaroErrorPlugin(Taro));

const App = createApp({
  onShow(options) {
    console.log('App onShow.');
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

export default App;
