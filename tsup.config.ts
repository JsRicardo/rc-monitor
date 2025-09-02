import { defineConfig } from 'tsup';

// 通用的tsup配置
export default defineConfig({
  // 输出格式
  format: ['esm', 'cjs'],
  // 目标环境
  target: 'es5',
  // 是否生成类型声明文件
  dts: true,
  // 是否生成source map
  sourcemap: false,
  // 清理输出目录
  clean: true,
  // 外部依赖配置 - 使用数组形式以支持序列化
  external: ['@rc-monitor/core', '@rc-monitor/utils', '@rc-monitor/adapter', '@rc-monitor/plugins'],

  // 插件配置
  plugins: [
    // 这里可以添加自定义插件
  ],
});
