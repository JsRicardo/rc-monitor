## 🚀 快速开始

### 安装

```bash
# 使用 npm
# npm install @rc-monitor/rc-monitor

# 使用 yarn
# yarn add @rc-monitor/rc-monitor

# 使用 pnpm
pnpm add @rc-monitor/rc-monitor
```

### 基本使用

```javascript
import Taro from '@tarojs/taro';
import { Monitor } from '@rc-monitor/rc-monitor';
import { BrowserPerformancePlugin } from '@rc-monitor/plugins';

// 初始化监控实例
const monitor = Monitor.getMonitor({
  appId: 'your-app-id',
  userId: 'user-123',
  reportUrl: 'https://your-report-server.com/api/report',
  // 配置是否开启不同类型的监控
  enableError: true,
  enablePerformance: true,
  enableBehavior: false,
  // 配置采样率
  samplingRate: 1.0,
  // 配置框架实例
  frameworkInstance: Taro,
});

// 使用插件 定义监控类型 和 数据转换函数
monitor.use(
  new BrowserPerformancePlugin(['FCP', 'LCP', 'TTFB', 'FID'], performanceData => transform(data))
);

// 启动监控
monitor.init();

// 手动上报数据
monitor.report({
  type: 'custom',
  data: { message: '用户点击了按钮' },
});
```
