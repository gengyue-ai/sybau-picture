# 🎭 Sybau Picture - AI图片生成平台

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-purple?style=flat-square&logo=stripe)](https://stripe.com)

> 🚀 Stay Young, Beautiful and Unique - 专业的AI图片生成平台！

## ✨ 功能特色

### 🔐 完整认证系统 **(最新修复)**
- **Google OAuth登录**：一键使用Google账户登录
- **邮箱密码注册**：传统的用户注册和登录方式
- **会话管理**：安全的用户会话和状态管理
- **自动重定向**：登录后智能跳转到目标页面
- **数据库优化**：完全修复的数据库字段名称规范化

### 💳 Stripe支付集成 **(全新功能)**
- **安全支付**：集成Stripe支付网关，支持全球信用卡
- **订阅管理**：自动化的订阅创建、更新和取消
- **客户门户**：用户可自主管理订阅和付款方式
- **Webhook处理**：实时处理支付状态更新
- **账单系统**：完整的发票和付款记录

### 🌍 双语支持
- **2种语言**：英语 (English) 和中文 (简体中文)
- **智能路由**：自动语言检测和本地化链接
- **SEO优化**：完整的SEO配置和sitemap系统

### 🤖 AI图片生成
- **Fal AI集成**：基于Flux模型的高质量AI图片生成
- **双重模式**：
  - 文本生成图片 (Text-to-Image)
  - 图片风格转换 (Image-to-Image)
- **文件上传**：支持JPG、PNG、WebP格式
- **实时生成**：快速AI图片生成体验

### 💰 三档定价系统
- **免费版**：每月3张图片，基础功能
- **标准版**：$9/月，每月50张图片，高分辨率
- **专业版**：$19/月，每月200张图片，超高分辨率
- **年付优惠**：按年付费享受37%折扣
- **即时升级**：通过Stripe实现即时订阅升级

### 📊 用户订阅管理 **(全新功能)**
- **订阅状态显示**：实时显示当前订阅计划和使用情况
- **使用量追踪**：每月图片生成次数统计
- **自动限制**：基于订阅计划的功能限制
- **升级提醒**：智能的订阅升级建议

### 🖼️ 画廊展示
- **实时案例**：使用真实AI生成的图片展示
- **创意风格**：展示各种Sybau风格的图片效果
- **下载功能**：支持图片下载和分享
- **点赞系统**：社区互动功能

### 🎨 现代UI
- **响应式设计**：完美适配桌面和移动设备
- **shadcn/ui组件**：现代化UI组件库
- **优雅动画**：流畅的交互体验
- **进度条组件**：实时显示订阅使用进度

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React全栈框架 (App Router)
- **TypeScript** - 类型安全开发
- **Tailwind CSS** - 实用优先的CSS框架
- **shadcn/ui** - 可重用组件库
- **Lucide React** - 图标库

### 后端 & 认证
- **Next.js API Routes** - 服务端API
- **NextAuth.js** - 身份验证系统
- **Prisma** - 数据库ORM (修复字段名规范)
- **PostgreSQL** - 生产数据库 (Supabase)

### 支付 & 订阅 **(新增)**
- **Stripe** - 支付处理和订阅管理
- **Stripe Customer Portal** - 客户自助服务门户
- **Stripe Webhooks** - 实时支付状态同步

### AI & 服务
- **Fal AI** - AI图片生成服务 (Flux模型)
- **Vercel** - 部署和托管平台

## 🚀 快速开始

### 前置要求
- Node.js 18.17.0+
- PostgreSQL数据库
- Fal AI API密钥
- Stripe账户 (用于支付功能)

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/gengyue-ai/sybau-picture.git
cd sybau-picture
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/sybau_picture"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI服务
FAL_KEY="your-fal-api-key"

# Stripe支付 (新增)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

4. **数据库设置**
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed  # 初始化价格方案
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
sybau-picture/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── auth/          # 认证API (修复完成)
│   │   ├── payment/       # 支付API (新增)
│   │   ├── subscription/  # 订阅API (新增)
│   │   ├── webhook/       # Webhook处理 (新增)
│   │   ├── generate/      # AI生成API
│   │   └── gallery/       # 画廊API
│   ├── auth/              # 认证页面
│   ├── payment/           # 支付页面 (新增)
│   ├── pricing/           # 定价页面
│   ├── gallery/           # 画廊页面
│   ├── help/              # 帮助页面
│   ├── support/           # 支持页面
│   ├── contact/           # 联系页面
│   └── zh/                # 中文页面
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   │   └── progress.tsx  # 进度条组件 (新增)
│   ├── ImageGenerator.tsx # 图片生成器组件
│   ├── SubscriptionStatus.tsx # 订阅状态组件 (新增)
│   ├── Navbar.tsx        # 导航栏
│   └── Footer.tsx        # 页脚
├── lib/                  # 工具库
│   ├── auth.ts           # 认证配置 (修复完成)
│   ├── stripe.ts         # Stripe配置 (新增)
│   ├── subscription.ts   # 订阅逻辑 (新增)
│   ├── i18n.ts           # 国际化
│   └── utils.ts          # 工具函数
├── prisma/               # 数据库模式
│   ├── schema.prisma     # 数据库模式 (字段名修复)
│   └── seed.ts           # 数据种子 (价格方案)
├── public/               # 静态资源
│   └── images/           # 图片资源
└── protection/           # 安全保护系统
```

## 🌍 多语言实现

### 支持的语言
| 语言 | 代码 | 路由前缀 | 状态 |
|------|------|----------|------|
| English | en | / (默认) | ✅ |
| 中文 | zh | /zh | ✅ |

### 本地化功能
- 🔄 **动态语言切换**
- 🔗 **本地化链接生成**
- 📱 **语言检测和重定向**
- 🎯 **SEO友好的URL**

## 🔧 API端点

### 认证 **(修复完成)**
- `POST /api/auth/signup` - 用户注册 (数据库字段修复)
- `GET/POST /api/auth/[...nextauth]` - NextAuth回调 (Google OAuth修复)

### 支付 & 订阅 **(全新API)**
- `POST /api/payment/create-checkout-session` - 创建Stripe支付会话
- `POST /api/payment/create-portal-session` - 创建客户门户会话
- `GET /api/subscription` - 获取用户订阅状态
- `POST /api/webhook/stripe` - Stripe Webhook处理

### 图片生成
- `POST /api/generate` - AI图片生成 (带订阅限制)
- `GET /api/gallery` - 图片画廊
- `POST /api/gallery/[id]/like` - 点赞图片
- `GET /api/gallery/[id]/download` - 下载图片

### 用户
- `GET /api/user/history` - 生成历史
- `DELETE /api/user/history/[id]` - 删除历史记录

### 多语言
- `GET /api/translations` - 获取翻译文本

## 🚀 部署指南

### Vercel部署

1. **准备环境变量**
   - 在Vercel仪表板添加所有环境变量
   - 配置生产数据库（推荐Supabase或Neon）
   - 设置Stripe生产环境密钥

2. **部署到Vercel**
```bash
vercel --prod
```

3. **部署后验证**
   - 检查英语和中文版本
   - 测试Google OAuth登录流程
   - 验证Stripe支付功能
   - 测试AI图片生成功能
   - 验证订阅管理功能

### 环境变量清单
```env
DATABASE_URL=                           # PostgreSQL数据库URL
NEXTAUTH_SECRET=                        # NextAuth密钥
NEXTAUTH_URL=                          # 生产域名
GOOGLE_CLIENT_ID=                      # Google OAuth客户端ID
GOOGLE_CLIENT_SECRET=                  # Google OAuth客户端密钥
FAL_KEY=                              # Fal AI API密钥
STRIPE_SECRET_KEY=                     # Stripe密钥 (新增)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=    # Stripe公开密钥 (新增)
STRIPE_WEBHOOK_SECRET=                 # Stripe Webhook密钥 (新增)
```

### Stripe配置
1. **创建产品和价格**
   - 在Stripe仪表板创建三个产品（免费、标准、专业）
   - 配置月付和年付价格
   - 更新数据库种子文件中的价格ID

2. **设置Webhook**
   - 在Stripe中添加webhook端点：`https://yourdomain.com/api/webhook/stripe`
   - 选择监听事件：`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## 🧪 测试

```bash
# 运行测试
npm run test

# 构建检查
npm run build

# 类型检查
npm run type-check

# 测试认证功能
npm run test:auth
```

## 📱 页面概览

### 核心页面
- **首页** - 集成图片生成器，展示核心功能
- **定价页面** - 三档价格方案，集成Stripe支付
- **支付成功页面** - 支付完成确认和订阅激活 (新增)
- **画廊页面** - 展示AI生成的精美图片
- **帮助页面** - 常见问题解答和使用指南
- **联系页面** - 技术支持和反馈渠道

### 功能页面
- **用户认证** - 注册、登录、Google OAuth (修复完成)
- **订阅管理** - 用户订阅状态和使用量显示 (新增)
- **历史记录** - 用户生成图片的历史管理
- **技术支持** - 在线帮助和FAQ系统

## 🎯 核心特性

### Sybau风格
- **Stay Young, Beautiful and Unique** - 专注于年轻、美丽、独特的创意风格
- **Gen Z文化** - 面向年轻用户的创意表达平台
- **多样化风格** - 支持各种创意和艺术风格

### 用户体验
- **一键生成** - 简单易用的图片生成流程
- **快速响应** - 优化的AI生成速度
- **移动友好** - 完美的移动端体验
- **社交分享** - 便捷的图片分享功能
- **订阅透明** - 清晰的使用量和订阅状态显示 (新增)

### 商业化功能 **(新增)**
- **灵活定价** - 三档订阅方案满足不同需求
- **即时支付** - Stripe集成的安全快速支付
- **自动管理** - 订阅自动续费和管理
- **全球支持** - 支持全球主要信用卡和支付方式

## 🔐 安全特性

- **保护系统** - 完整的文件保护和完整性检查
- **数据加密** - 用户数据和图片的安全存储
- **支付安全** - Stripe PCI DSS合规的支付处理
- **访问控制** - 基于订阅的功能权限管理
- **API安全** - 完整的API安全防护和速率限制

## 🆕 最新更新 (v2.0)

### 🔧 重大修复
- ✅ **认证系统完全修复** - 解决数据库字段名不匹配问题
- ✅ **Google OAuth正常工作** - 修复登录流程和重定向
- ✅ **用户注册功能恢复** - 邮箱密码注册完全正常
- ✅ **会话管理稳定** - NextAuth session管理优化

### 🚀 全新功能
- 🆕 **Stripe支付集成** - 完整的支付和订阅系统
- 🆕 **订阅管理界面** - 用户可视化订阅状态管理
- 🆕 **客户门户** - 用户自助修改付款方式和查看账单
- 🆕 **使用量统计** - 实时显示每月图片生成次数
- 🆕 **Webhook同步** - 支付状态实时同步到数据库

### 🛠️ 技术改进
- 📈 **数据库优化** - 字段名规范化，提升查询性能
- 🔒 **安全增强** - 加强API安全和用户数据保护
- 📱 **UI改进** - 新增进度条和订阅状态组件
- ⚡ **性能优化** - 减少加载时间，提升用户体验

## 📧 联系我们

- **技术支持**: support@sybaupicture.com
- **一般咨询**: hello@sybaupicture.com
- **GitHub**: https://github.com/gengyue-ai/sybau-picture

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">
  <p>🎭 <strong>Sybau Picture</strong> - 让每个人都能创造美丽独特的AI艺术作品</p>
  <p>Made with ❤️ by Gengyue AI</p>
  <p><strong>v2.0</strong> - 认证修复 & 支付集成完成</p>
</div>
