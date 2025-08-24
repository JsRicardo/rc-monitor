# RC Monitor 使用指南

## 项目概述

RC Monitor 是一个跨平台的插件化前端监控工具，支持浏览器、Node.js、小程序和 React Native 环境。

## 架构设计

### 核心架构
```
RC Monitor
├── Core (核心库)
├── Plugins (插件系统)
│   ├── Error Monitoring (错误监控)
│   ├── Performance Monitoring (性能监控)
│   └── Behavior Monitoring (行为监控)
└── Adapters (适配器)
    ├── React Adapter
    └── Vue Adapter
```

### 插件系统
每个插件都是独立的模块，可以按需加载：
- **错误监控插件**: 捕获 JS 错误、Promise 错误、资源加载错误
- **性能监控插件**: 监控页面性能、资源性能、用户交互性能
- **行为监控插件**: 跟踪用户点击、页面浏览、表单交互

### 适配器系统
提供框架特定的集成：
- **React**: Hooks、HOC、Error Boundary
- **Vue**: 插件、组合式 API、指令

## 安装和设置

### 安装依赖
```bash
pnpm install
```

### 构建项目
```bash
pnpm run build
```

### 开发模式
```bash
pnpm run dev
```

## 核心包说明

### @rc-monitor/core
核心监控库，提供：
- 监控器实例管理
- 插件生命周期管理
- 事件发射和处理
- 适配器接口

### @rc-monitor/utils
工具函数库，包含：
- 性能测量工具
- 错误安全执行
- 节流和防抖
- 环境检测
- 存储工具

## 插件使用

### 错误监控插件
```javascript
import { ErrorPlugin } from '@rc-monitor/plugin-error';

const errorPlugin = new ErrorPlugin({
  captureJsErrors: true,
  capturePromiseErrors: true,
  captureResourceErrors: true,
  maxErrorCount: 100,
  ignoreErrors: [/Script error/]
});
```

### 性能监控插件
```javascript
import { PerformancePlugin } from '@rc-monitor/plugin-performance';

const performancePlugin = new PerformancePlugin({
  captureNavigationTiming: true,
  captureResourceTiming: true,
  captureLongTasks: true,
  threshold: 100,
  samplingRate: 0.5
});
```

### 行为监控插件
```javascript
import { BehaviorPlugin } from '@rc-monitor/plugin-behavior';

const behaviorPlugin = new BehaviorPlugin({
  captureClicks: true,
  capturePageViews: true,
  captureFormInteractions: true,
  sessionTimeout: 1800000
});
```

## 框架集成

### React 集成
```jsx
import { MonitorProvider, useMonitor } from '@rc-monitor/adapter-react';

function App() {
  return (
    <MonitorProvider
      config={{ appId: 'react-app' }}
      plugins={[errorPlugin, performancePlugin]}
    >
      <YourApp />
    </MonitorProvider>
  );
}

function Component() {
  const monitor = useMonitor();
  // 使用监控功能
}
```

### Vue 集成
```javascript
import { monitorPlugin } from '@rc-monitor/adapter-vue';

const app = createApp(App);
app.use(monitorPlugin, {
  appId: 'vue-app',
  plugins: [errorPlugin, performancePlugin]
});
```

## 自定义开发

### 创建自定义插件
```javascript
import { Plugin } from '@rc-monitor/core';

class CustomPlugin {
  name = 'custom-plugin';
  version = '1.0.0';
  
  install(monitor) {
    // 插件安装逻辑
  }
  
  uninstall() {
    // 插件卸载逻辑
  }
}
```

### 创建自定义适配器
```javascript
import { Adapter } from '@rc-monitor/core';

class CustomAdapter {
  type = 'custom';
  
  init(config) {
    // 适配器初始化
  }
  
  send(event) {
    // 事件发送逻辑
  }
}
```

## 配置选项

### 核心配置
```typescript
interface MonitorConfig {
  appId: string;           // 必需：应用ID
  version?: string;        // 可选：应用版本
  environment?: string;    // 可选：环境标识
  plugins?: PluginConfig[]; // 可选：插件配置
  adapter?: AdapterConfig;  // 可选：适配器配置
}
```

### 事件格式
```typescript
interface MonitorEvent {
  type: string;            // 事件类型
  timestamp: number;       // 时间戳
  data: Record<string, any>; // 事件数据
  context?: Record<string, any>; // 上下文信息
}
```

## 最佳实践

### 生产环境配置
```javascript
const monitor = new RCMonitor({
  appId: 'your-app-id',
  version: process.env.APP_VERSION,
  environment: 'production',
  plugins: [
    new ErrorPlugin({ maxErrorCount: 1000 }),
    new PerformancePlugin({ samplingRate: 0.1 })
  ]
});
```

### 开发环境配置
```javascript
const monitor = new RCMonitor({
  appId: 'your-app-id',
  environment: 'development',
  plugins: [
    new ErrorPlugin({ maxErrorCount: 50 }),
    new BehaviorPlugin() // 详细的行为跟踪
  ]
});
```

## 故障排除

### 常见问题

1. **插件未生效**
   - 检查插件是否正确安装
   - 确认插件配置选项

2. **事件未发送**
   - 检查网络连接
   - 验证适配器配置

3. **性能问题**
   - 调整采样率
   - 优化插件配置

### 调试模式

启用详细日志：
```javascript
const monitor = new RCMonitor({
  appId: 'debug-app',
  environment: 'development'
});

// 监听所有事件
monitor.on('*', (event) => {
  console.log('Monitor Event:', event);
});
```

## 扩展开发

### 添加新插件
1. 在 `packages/` 目录下创建新插件包
2. 实现 Plugin 接口
3. 更新 rollup 配置
4. 添加类型定义

### 添加新适配器
1. 在 `packages/` 目录下创建新适配器包
2. 实现 Adapter 接口
3. 提供框架特定的集成
4. 更新构建配置

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件