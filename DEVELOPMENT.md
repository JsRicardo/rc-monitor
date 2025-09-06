# 开发指南

## 项目结构

项目使用 monorepo 架构，通过 ppnpm workspace 管理多个包：

```
├── packages/
│   ├── utils/        # 基础工具库
│   ├── core/         # 核心功能模块
│   ├── adapter/      # 适配器模块
│   ├── plugins/      # 插件集合
│   └── rc-monitor/   # 主入口包
├── scripts/          # 开发脚本
├── examples/         # 示例代码
├── docs/             # 文档
└── test/             # 测试文件
```

## 代码规范

### ESLint

项目使用 ESLint 进行代码质量检查，配置位于 `.eslintrc.js`

主要规则：

- 使用 2 空格缩进
- 使用单引号
- 强制分号
- TypeScript 严格类型检查

### Prettier

项目使用 Prettier 进行代码格式化，配置位于 `.prettierrc`

### EditorConfig

统一编辑器配置，位于 `.editorconfig`

## Git 提交规范

### Commitizen

使用 Commitizen 进行交互式提交：

```bash
pnpm run commit
```

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动
- `revert`: 回退提交

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Git 工作流

### Husky

使用 Husky 设置 Git 钩子：

- `pre-commit`: 运行 lint-staged
- `commit-msg`: 验证提交消息格式
- `pre-push`: 运行测试

### lint-staged

在提交前自动格式化暂存区的文件

## 开发脚本

项目提供了多个开发脚本，位于 `scripts/` 目录：

### 构建脚本 (build.js)

```bash
# 构建所有包
pnpm run build

# 构建指定包
pnpm run build <package-name>

# 列出所有可用包
pnpm run build --list-packages
```

### 开发模式脚本 (dev.js)

```bash
# 开发所有包
pnpm run dev

# 开发指定包
pnpm run dev <package-name>

# 列出所有可用包
pnpm run dev --list-packages
```

> **注意**：开发模式会在单独的终端窗口中启动每个包的开发服务器。

### 发布脚本 (release.js)

```bash
# 发布所有包
pnpm run release --all

# 仅发布有变更的包
pnpm run release --changed

# 发布指定包
pnpm run release --package <package-name>

# 测试发布过程（不实际发布）
pnpm run release --all --dry-run

# 指定版本递增类型
pnpm run release --all --patch # 补丁版本（默认）
pnpm run release --all --minor # 次要版本
pnpm run release --all --major # 主要版本

# 列出所有可用包
pnpm run release --list-packages
```

### 其他脚本

```bash
# 运行测试
pnpm run test

# 代码检查
pnpm run lint

# 自动修复代码问题
pnpm run lint:fix

# 代码格式化
pnpm run format

# 类型检查
pnpm run typecheck

# 交互式提交
pnpm run commit
```

## 脚本工具库

项目在 `scripts/utils.js` 中提供了共享的工具函数，被 build.js、dev.js 和 release.js 共同使用：

- `getPackages()`: 获取所有包列表
- `getSortedPackages(packages, dependencies)`: 根据依赖关系对包进行拓扑排序
- `getPackageVersion(pkgName)`: 获取包的当前版本
- `incrementVersion(currentVersion, type)`: 递增版本号
- `hasChanges(pkgName)`: 检查包是否有变更
- `showPackageList(packages, dependencies)`: 显示包列表信息
- `validatePackageNames(pkgNames, validPackages)`: 验证包名是否有效

## 包管理

项目使用 pnpm workspace 管理多个包，包位于 `packages/` 目录下。

每个包应该有：

- 源代码放在 `src/` 目录
- 构建输出到 `dist/` 目录
- 测试代码放在 `__test__/` 目录

## 开发流程

1. 创建功能分支
2. 开发实现
3. 运行测试和代码检查
4. 提交代码（使用 `pnpm run commit`）
5. 创建 Pull Request
6. Code Review
7. 合并到主分支
