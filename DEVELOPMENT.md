# 开发规范

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
npm run commit
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

```bash
# 构建所有包
npm run build

# 开发模式
npm run dev

# 运行测试
npm run test

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format

# 类型检查
npm run typecheck

# 交互式提交
npm run commit
```

## 包管理

项目使用 pnpm workspace 管理多个包，包位于 `packages/` 目录下。

每个包应该有：

1. 独立的 `package.json`
2. 源代码放在 `src/` 目录
3. 构建输出到 `dist/` 目录

## 开发流程

1. 创建功能分支
2. 开发实现
3. 运行测试和代码检查
4. 提交代码（使用 `npm run commit`）
5. 创建 Pull Request
6. Code Review
7. 合并到主分支
