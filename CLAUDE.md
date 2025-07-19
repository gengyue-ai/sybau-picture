# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Sybau Picture 是一个基于 Next.js 14 的 AI 图片生成平台，核心特色是"Stay Young, Beautiful and Unique"。这是一个**生产就绪**的项目，已完成 Google OAuth 认证、Stripe 支付、AI 图片生成和多语言支持。

## 核心架构

### 技术栈
- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI组件**: shadcn/ui + Lucide React
- **认证**: NextAuth.js + Google OAuth
- **数据库**: PostgreSQL + Prisma ORM
- **支付**: Stripe 订阅系统
- **AI服务**: Fal AI (Flux模型)
- **部署**: Vercel

### 关键目录结构
```
app/
├── api/              # API路由 (认证、支付、AI生成)
├── auth/             # 认证页面
├── zh/               # 中文本地化页面
├── pricing/          # 定价页面
└── gallery/          # 图片画廊

lib/
├── auth.ts           # NextAuth配置
├── stripe.ts         # Stripe支付配置
├── env-manager.ts    # 环境管理系统
├── prisma.ts         # 数据库配置
└── i18n.ts           # 国际化配置

components/
├── ui/               # shadcn/ui基础组件
├── ImageGenerator.tsx # AI图片生成器
├── SubscriptionStatus.tsx # 订阅状态显示
└── Navbar.tsx        # 导航栏

scripts/
├── smart-env.js      # 智能环境管理
├── smart-startup.js  # 智能启动脚本
└── smart-env-v3.js   # 环境管理v3
```

## 关键文件说明

### 数据库模型 (prisma/schema.prisma)
- `User`: 用户模型，包含 Google OAuth 信息和订阅关联
- `Plan`: 套餐模型 (免费/标准/专业)
- `Subscription`: 订阅记录，关联 Stripe
- `UserUsage`: 用户使用统计
- `GeneratedImage`: AI生成的图片记录

### 认证系统 (lib/auth.ts)
- 使用 NextAuth.js 配置 Google OAuth
- 智能环境管理 (开发/生产)
- 自动用户创建和头像更新
- 订阅状态集成

### 支付系统 (lib/stripe.ts)
- Stripe 集成，支持订阅管理
- 三档定价: 免费(1张/月)、标准($9/月,50张)、专业($19/月,200张)
- 自动化 webhook 处理

### 环境管理 (lib/env-manager.ts)
- 双环境架构: 开发/生产
- 智能环境切换和验证
- 统一的配置管理

## 常用开发命令

### 环境管理和保护 🔒
```bash
# 环境初始化（首次运行）
npm run env:protect:init            # 初始化环境保护系统

# 环境验证
npm run env:verify                  # 完整环境配置验证
npm run env:check                   # 快速环境检查
npm run env:status                  # 环境状态报告

# 环境保护
npm run env:protect:backup          # 备份环境文件
npm run env:protect:restore         # 恢复环境文件
npm run env:protect:verify          # 验证文件完整性
npm run env:protect:save            # 保存当前环境校验和

# 传统环境切换（已弃用，建议直接编辑.env文件）
node scripts/smart-env.js 开发      # 切换开发环境
node scripts/smart-env.js 生产      # 切换生产环境 
```

### 开发服务器
```bash
npm run start:smart                 # 智能启动 (推荐)
npm run dev                         # 标准启动
```

### 构建和测试
```bash
npm run build                       # 构建生产版本
npm run type-check                  # TypeScript 类型检查
npm run lint                        # ESLint 检查
```

### 数据库操作
```bash
npm run db:generate                 # 生成 Prisma 客户端
npm run db:push                     # 推送模式变更
npm run db:seed                     # 数据种子
npm run db:studio                   # Prisma Studio
```

### 保护系统
```bash
npm run protect:check               # 检查文件完整性
npm run protect:build               # 构建前检查
npm run protect:backup              # 备份文件
```

## 重要配置

### 环境变量配置 🔒

**新的AI-Proof环境管理**：
- 开发环境配置文件：`.env.development.local`（被AI保护）
- 生产环境配置文件：`.env.production.local`（模板文件）
- 实际生产环境变量在 Vercel 中配置

#### 开发环境配置示例：
```env
# .env.development.local
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3001
DATABASE_URL=postgresql://user:pass@localhost:5432/sybau_dev
GOOGLE_CLIENT_ID=your-dev-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-dev-secret
STRIPE_SECRET_KEY=sk_test_your_dev_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_dev_stripe_key
FAL_KEY=your-fal-api-key
```

#### 生产环境（Vercel配置）：
```env
# 在 Vercel Dashboard 中配置
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@prod-host:5432/sybau_prod
GOOGLE_CLIENT_ID=your-prod-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-prod-secret
STRIPE_SECRET_KEY=sk_live_your_prod_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_prod_stripe_key
FAL_KEY=your-fal-api-key
```

### 多语言支持
项目支持中英文双语:
- 默认语言: 英文 (/)
- 中文路由: /zh/*
- 语言切换通过 middleware.ts 处理

### 订阅系统
- 免费计划: 1张/月
- 标准计划: $9/月, 50张
- 专业计划: $19/月, 200张
- 年付折扣: 37% off

## 开发注意事项

### 🔒 AI-Proof 环境管理系统
- **严禁AI修改环境文件**：`.env.development.local` 和 `.env.production.local` 受保护
- **首次设置**：运行 `npm run env:protect:init` 初始化保护系统
- **开发前验证**：运行 `npm run env:verify` 确保配置正确
- **环境切换**：直接编辑 `.env.development.local`，无需脚本切换
- **异常恢复**：运行 `npm run env:protect:restore` 从备份恢复

### 认证流程
- Google OAuth 已完全配置，支持头像自动更新
- 新用户自动分配免费计划
- 会话管理使用 JWT 策略

### 支付集成
- Stripe 已完全集成，支持订阅管理
- Webhook 处理订阅状态变更
- 客户门户支持自助管理

### 文件完整性
- 项目包含完整的文件保护系统
- 使用 `npm run protect:check` 验证文件完整性
- 重要文件有自动备份机制

## 测试和部署

### 本地测试
```bash
npm run start:smart                 # 启动开发服务器
npm run type-check                  # 类型检查
npm run build                       # 构建测试
```

### 🚀 无缝部署到生产环境

#### 准备工作：
1. **验证开发环境**：`npm run env:verify`
2. **确保Vercel环境变量配置**：在Vercel Dashboard配置所有生产环境变量
3. **测试构建**：`npm run build`

#### 部署步骤：
```bash
# 1. 最终验证
npm run env:verify

# 2. 构建验证
npm run build

# 3. 部署到Vercel
vercel --prod

# 4. 部署后验证
# 访问生产URL测试所有功能
```

#### 环境变量迁移清单：
- ✅ `NODE_ENV=production`
- ✅ `NEXTAUTH_URL=https://yourdomain.com`
- ✅ `DATABASE_URL`（生产数据库）
- ✅ `GOOGLE_CLIENT_ID`（生产OAuth）
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `STRIPE_SECRET_KEY`（生产密钥）
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `FAL_KEY`

### 部署验证
- Google OAuth 登录功能
- Stripe 支付流程
- AI 图片生成功能
- 多语言切换功能

## 常见问题

### 端口冲突
使用 `npm run start:smart` 自动处理端口冲突

### 环境配置问题
运行 `node scripts/smart-env.js 状态` 检查环境状态

### 数据库连接问题
检查 `DATABASE_URL` 环境变量配置

### 构建失败
运行 `npm run type-check` 检查 TypeScript 错误

## 开发最佳实践

1. **环境管理**: 始终使用智能环境管理系统
2. **类型安全**: 严格使用 TypeScript 类型定义
3. **组件复用**: 优先使用 shadcn/ui 组件
4. **响应式设计**: 遵循 mobile-first 原则
5. **错误处理**: API 路由必须包含错误处理
6. **安全性**: 绝不在代码中硬编码敏感信息
7. **国际化**: 新功能需支持中英文双语

## 项目状态

当前版本: v3.0 - 生产就绪版
- ✅ Google OAuth 认证完全正常
- ✅ Stripe 支付系统完整运行
- ✅ AI 图片生成功能正常
- ✅ 多语言支持完整
- ✅ 用户订阅管理完善
- ✅ 文件保护系统完整