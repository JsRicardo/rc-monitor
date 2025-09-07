import { createApp } from 'vue';

import './app.less';
import { Monitor } from '@rc-monitor/rc-monitor';
import { TaroErrorPlugin, TaroBehaviorPlugin } from '@rc-monitor/plugins';
import Taro from '@tarojs/taro';
import { onAppShow } from '@tarojs/taro';

const monitor = Monitor.getMonitor({
  appId: '123',
  endpoint: 'http://localhost:3000/api/error',
  reporterType: 'xhr',
  frameworkInstance: Taro,
});

// 使用错误监控插件
monitor.use(new TaroErrorPlugin());
// 使用行为监控插件
monitor.use(new TaroBehaviorPlugin());

Taro.getPerformance()
  .createObserver(function (entryList) {
    entryList.getEntries().forEach(entry => {
      console.error('🚀 ~ app.ts:24 ~ entry:', entry);
    });
  })
  // @ts-ignore
  .observe({
    entryTypes: ['navigation', 'script', 'render'],
  });

onAppShow(res => {
  // Taro.getCurrentInstance().router?.path;
  console.error('onAppShow', Taro.getCurrentInstance());
});

const App = createApp({
  onShow(options) {
    console.log('App onShow.');
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

export default App;
