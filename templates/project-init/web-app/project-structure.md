# 🏗️ Web应用项目标准结构

## 📁 目录结构

```
{{PROJECT_NAME}}/
├── app/                        # Next.js App Router (主应用目录)
│   ├── (auth)/                 # 路由组 - 认证相关页面
│   │   ├── login/
│   │   │   └── page.tsx       # 登录页面
│   │   └── register/
│   │       └── page.tsx       # 注册页面
│   ├── api/                   # API 路由
│   │   ├── auth/              # 认证API
│   │   │   └── route.ts
│   │   ├── users/             # 用户API
│   │   │   └── route.ts
│   │   └── health/            # 健康检查API
│   │       └── route.ts
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局组件
│   ├── loading.tsx            # 全局加载组件
│   ├── error.tsx              # 全局错误组件
│   ├── not-found.tsx          # 404页面
│   └── page.tsx               # 首页
├── components/                # React组件
│   ├── ui/                    # 基础UI组件
│   │   ├── button.tsx         # 按钮组件
│   │   ├── input.tsx          # 输入框组件
│   │   ├── modal.tsx          # 模态框组件
│   │   └── index.ts           # 组件导出
│   ├── layout/                # 布局组件
│   │   ├── header.tsx         # 页头组件
│   │   ├── footer.tsx         # 页脚组件
│   │   ├── navbar.tsx         # 导航栏组件
│   │   └── sidebar.tsx        # 侧边栏组件
│   ├── features/              # 功能组件
│   │   ├── auth/              # 认证相关组件
│   │   ├── dashboard/         # 仪表板组件
│   │   └── profile/           # 用户资料组件
│   └── providers/             # 上下文提供者
│       ├── theme-provider.tsx # 主题提供者
│       └── auth-provider.tsx  # 认证提供者
├── lib/                       # 工具库和配置
│   ├── auth.ts                # 认证配置
│   ├── database.ts            # 数据库配置
│   ├── env.ts                 # 环境变量验证
│   ├── utils.ts               # 通用工具函数
│   ├── validations.ts         # 数据验证
│   └── constants.ts           # 常量定义
├── hooks/                     # 自定义React Hooks
│   ├── use-auth.ts            # 认证Hook
│   ├── use-local-storage.ts   # 本地存储Hook
│   └── use-debounce.ts        # 防抖Hook
├── types/                     # TypeScript类型定义
│   ├── auth.ts                # 认证相关类型
│   ├── api.ts                 # API相关类型
│   └── global.d.ts            # 全局类型声明
├── styles/                    # 样式文件
│   ├── globals.css            # 全局样式
│   └── components.css         # 组件样式
├── public/                    # 静态资源
│   ├── images/                # 图片资源
│   ├── icons/                 # 图标资源
│   ├── favicon.ico            # 网站图标
│   └── robots.txt             # 搜索引擎配置
├── scripts/                   # 开发脚本
│   ├── smart-startup.js       # 智能启动脚本
│   ├── smart-env.js           # 环境切换脚本
│   ├── setup-dev.js           # 开发环境设置
│   └── deploy.js              # 部署脚本
├── docs/                      # 项目文档
│   ├── README.md              # 项目说明
│   ├── API.md                 # API文档
│   ├── CONTRIBUTING.md        # 贡献指南
│   └── DEPLOYMENT.md          # 部署指南
├── tests/                     # 测试文件
│   ├── __mocks__/             # 模拟数据
│   ├── setup.ts               # 测试设置
│   ├── utils.test.ts          # 工具函数测试
│   └── components/            # 组件测试
│       ├── button.test.tsx
│       └── header.test.tsx
├── e2e/                       # E2E测试
│   ├── auth.spec.ts           # 认证流程测试
│   ├── dashboard.spec.ts      # 仪表板测试
│   └── fixtures/              # 测试数据
├── prisma/                    # 数据库模式 (可选)
│   ├── schema.prisma          # 数据库模式
│   ├── migrations/            # 数据库迁移
│   └── seed.ts                # 数据种子
├── .env.example               # 环境变量示例
├── .env.local                 # 本地环境变量
├── .gitignore                 # Git忽略文件
├── .eslintrc.json             # ESLint配置
├── .prettierrc                # Prettier配置
├── tsconfig.json              # TypeScript配置
├── tailwind.config.js         # Tailwind CSS配置
├── next.config.js             # Next.js配置
├── package.json               # 项目依赖和脚本
├── playwright.config.ts       # Playwright E2E测试配置
├── jest.config.js             # Jest测试配置
├── jest.setup.js              # Jest设置文件
└── README.md                  # 项目说明文档
```

## 📋 目录说明

### 核心应用目录
- **`app/`**: Next.js 13+ App Router的主目录，包含所有页面和API路由
- **`components/`**: 所有React组件，按功能和复用性分类组织
- **`lib/`**: 工具函数、配置文件和通用逻辑
- **`hooks/`**: 自定义React Hooks，提高逻辑复用性
- **`types/`**: TypeScript类型定义，确保类型安全

### 开发支持目录
- **`scripts/`**: 开发、构建、部署相关的脚本文件
- **`docs/`**: 项目文档，包括API文档、贡献指南等
- **`tests/`**: 单元测试和集成测试文件
- **`e2e/`**: 端到端测试文件

### 配置文件
- **环境配置**: `.env.example`, `.env.local`
- **代码质量**: `.eslintrc.json`, `.prettierrc`
- **构建配置**: `next.config.js`, `tsconfig.json`
- **样式配置**: `tailwind.config.js`
- **测试配置**: `jest.config.js`, `playwright.config.ts`

## 🎯 组件组织原则

### UI组件 (`components/ui/`)
- **原子级组件**: 最基础的UI元素 (Button, Input, Modal等)
- **高复用性**: 在多个页面和功能中使用
- **无业务逻辑**: 纯展示组件，通过props接收数据
- **标准化**: 统一的API设计和样式规范

### 布局组件 (`components/layout/`)
- **页面结构**: Header, Footer, Navbar, Sidebar等
- **响应式设计**: 适配不同屏幕尺寸
- **导航逻辑**: 页面间导航和状态管理

### 功能组件 (`components/features/`)
- **业务逻辑**: 包含具体业务功能的组件
- **功能分组**: 按功能模块组织 (auth, dashboard, profile等)
- **状态管理**: 可能包含复杂的状态逻辑

## 🔧 文件命名规范

### 组件文件
- **React组件**: 使用PascalCase，如 `UserProfile.tsx`
- **页面组件**: 使用 `page.tsx` (App Router规范)
- **布局组件**: 使用 `layout.tsx`
- **加载组件**: 使用 `loading.tsx`
- **错误组件**: 使用 `error.tsx`

### 工具文件
- **工具函数**: 使用kebab-case，如 `date-utils.ts`
- **配置文件**: 使用kebab-case，如 `auth-config.ts`
- **类型定义**: 使用kebab-case，如 `user-types.ts`

### Hook文件
- **自定义Hooks**: 使用 `use-` 前缀，如 `use-auth.ts`

## 📊 最佳实践

### 文件组织
1. **单一职责**: 每个文件只负责一个功能或组件
2. **逻辑分层**: 明确分离UI、业务逻辑和数据层
3. **模块化**: 合理的模块划分，便于维护和测试
4. **可扩展**: 结构设计考虑未来功能扩展

### 导入导出
```typescript
// 统一的导出方式
export { Button } from './button'
export { Input } from './input'
export { Modal } from './modal'

// 类型和实现分离
export type { UserProfile } from './types'
export { UserProfileComponent } from './component'
```

### 环境管理
```bash
# 开发环境
.env.local          # 本地开发配置
.env.development    # 开发环境配置

# 生产环境
.env.production     # 生产环境配置
.env.example        # 环境变量模版
```

## 🚀 快速启动

### 1. 项目初始化
```bash
# 使用模版创建项目
npx create-project-template {{PROJECT_NAME}} --type=web-app

# 安装依赖
cd {{PROJECT_NAME}}
npm install
```

### 2. 环境配置
```bash
# 复制环境变量模版
cp .env.example .env.local

# 配置开发环境
npm run env:dev
```

### 3. 启动开发
```bash
# 智能启动（自动端口检查）
npm run start:smart

# 或标准启动
npm run dev
```

### 4. 质量检查
```bash
# 运行所有质量检查
npm run quality:check

# 单独运行检查
npm run lint          # 代码风格检查
npm run type-check    # 类型检查
npm run test          # 单元测试
```

## 📝 开发规范

### 代码风格
- **TypeScript严格模式**: 启用所有严格类型检查
- **ESLint配置**: 使用推荐的规则集
- **Prettier格式化**: 统一的代码格式
- **Git Hooks**: 提交前自动检查和格式化

### 测试策略
- **单元测试**: 覆盖工具函数和组件逻辑
- **集成测试**: 测试组件间交互
- **E2E测试**: 测试完整用户流程
- **覆盖率要求**: 最低80%测试覆盖率

### 文档要求
- **README**: 项目概述和快速开始
- **API文档**: 完整的API接口文档
- **组件文档**: 重要组件的使用说明
- **部署文档**: 详细的部署指南

---

> 🏗️ **标准项目结构** - 为高质量代码奠定基础！
>
> 遵循这个结构规范，让您的项目更加清晰、可维护、可扩展。
