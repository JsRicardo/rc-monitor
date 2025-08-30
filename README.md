# rc-monitor

## 📦 跨平台插件化前端监控工具

rc-monitor 是一个轻量级、高性能、插件化的前端监控解决方案，支持多平台（Web、小程序、React Native等）错误监控、性能监控和用户行为分析。

## ✨ 主要特性

- **跨平台支持**：支持浏览器、微信小程序、Taro、UniApp等多个前端平台
- **插件化架构**：核心功能与业务逻辑解耦，易于扩展和定制
- **全面监控能力**：错误监控、性能监控、用户行为分析
- **轻量级设计**：核心包体积小，插件按需加载
- **TypeScript 支持**：完整的类型定义，提供良好的开发体验
- **多框架适配**：支持React、Vue等主流前端框架

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install @rc-monitor/rc-monitor

# 使用 yarn
# yarn add @rc-monitor/rc-monitor

# 使用 pnpm
# pnpm add @rc-monitor/rc-monitor
```

### 基本使用

```javascript
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

## 📁 目录结构

项目采用 monorepo 架构，使用 pnpm workspace 管理多包，主要包含以下核心模块：

```
├── packages/
│   ├── core/         # 监控 SDK 核心框架
│   ├── plugins/      # 各类监控插件（错误/性能/行为等）
│   ├── adapter/      # 适配层代码
│   ├── platform/     # 平台相关代码
│   ├── utils/        # 通用工具函数库
│   └── rc-monitor/   # 集成所有功能的完整SDK
├── examples/         # 使用示例代码
├── scripts/          # 构建和开发脚本
├── tsconfig.json     # TypeScript 配置文件
├── tsup.config.ts    # tsup 构建配置
└── package.json      # 项目配置和依赖
```

### 核心模块说明

- **@rc-monitor/core**：提供监控SDK的核心功能，包括初始化、数据收集、上报、插件系统等基础能力
- **@rc-monitor/plugins**：包含各类监控插件，如错误监控、性能监控、用户行为监控等
- **@rc-monitor/adapter**：提供与各前端框架的适配代码
- **@rc-monitor/platform**：提供与不同平台（Web、小程序等）的适配代码
- **@rc-monitor/utils**：提供各类通用工具函数
- **@rc-monitor/rc-monitor**：集成上述所有模块的完整SDK，提供开箱即用的监控解决方案

## 🛠️ 开发指南

### 环境准备

1. 安装 [Node.js](https://nodejs.org/) (建议 v16.0+)
2. 安装 [pnpm](https://pnpm.io/)
   ```bash
   npm install -g pnpm
   ```
3. 克隆代码并安装依赖
   ```bash
   git clone <repository-url>
   cd rc-monitor
   pnpm install
   ```

### 开发命令

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:core       # 构建核心包
pnpm build:plugins    # 构建插件包
pnpm build:utils      # 构建工具包
pnpm build:platform   # 构建平台包
pnpm build:rc-monitor # 构建完整SDK

# 开发模式（监视文件变化并自动重新构建）
pnpm dev
pnpm dev:core

# 代码检查
pnpm lint
pnpm lint:fix         # 自动修复代码问题

# 代码格式化
pnpm format

# 类型检查
pnpm typecheck

# 拼写检查
pnpm spellcheck
pnpm spellcheck:fix

# 测试
pnpm test

# 清理构建产物
pnpm clean

# 提交代码（使用 commitizen 规范提交信息）
pnpm commit
```

## 📝 插件开发

rc-monitor 采用插件化架构，便于扩展和定制监控功能。以下是开发自定义插件的基本步骤：

1. 创建插件类，实现 Plugin 接口
2. 注册插件到监控实例

详细的插件开发文档请参考 [DEVELOPMENT.md](DEVELOPMENT.md)。

## 📖 文档

- [快速开始](docs/GETTING-STARTED.md)：详细的安装和基本使用指南
- [API 参考](docs/API.md)：完整的 API 文档
- [插件开发指南](DEVELOPMENT.md)：如何开发自定义插件
- [配置指南](docs/CONFIGURATION.md)：所有配置项的详细说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 项目
2. 创建特性分支
3. 提交代码
4. 推送到远程分支
5. 创建 Pull Request

请确保遵循项目的代码规范和提交信息格式。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 📧 联系我们

如有问题或建议，欢迎联系项目维护者。
