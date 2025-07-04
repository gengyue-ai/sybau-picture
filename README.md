# 🎭 Sybau Picture - AI图片生成器

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=flat-square&logo=vercel)](https://vercel.com)

> 🚀 使用AI技术创建令人惊叹的Sybau风格图片！

## ✨ 功能特色

### 🌍 多语言支持
- **10种语言**：英语、中文、西班牙语、日语、韩语、法语、德语、葡萄牙语、俄语、阿拉伯语
- **智能路由**：自动语言检测和本地化链接
- **SEO优化**：每种语言独立的SEO配置

### 🤖 AI图片生成
- **Fal AI集成**：高质量AI图片生成
- **多种模式**：经典、夸张、专业、创意
- **文件上传**：支持JPG、PNG、WebP格式
- **实时生成**：8秒内完成高质量图片

### 👤 用户系统
- **Google OAuth**：快速社交登录
- **传统注册**：用户名密码注册
- **历史记录**：生成图片历史管理
- **个人资料**：用户信息管理

### 🎨 现代UI
- **响应式设计**：完美适配所有设备
- **shadcn/ui组件**：现代化UI组件库
- **暗色主题**：舒适的视觉体验
- **动画效果**：流畅的交互动画

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的CSS框架
- **shadcn/ui** - 可重用组件库
- **Framer Motion** - 动画库

### 后端
- **Next.js API Routes** - 服务端API
- **NextAuth.js** - 身份验证
- **Prisma** - 数据库ORM
- **PostgreSQL** - 生产数据库

### AI & 服务
- **Fal AI** - AI图片生成服务
- **Vercel** - 部署平台
- **PostHog** - 分析工具

## 🚀 快速开始

### 前置要求
- Node.js 18.17.0+
- PostgreSQL数据库
- Fal AI API密钥

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/your-username/sybau-picture.git
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
```

4. **数据库设置**
```bash
npm run setup:db
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
│   ├── [lang]/            # 多语言页面
│   ├── api/               # API路由
│   ├── auth/              # 认证页面
│   └── (pages)/           # 应用页面
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   └── (features)/       # 功能组件
├── lib/                  # 工具库
│   ├── auth.ts           # 认证配置
│   ├── i18n.ts           # 国际化
│   └── utils.ts          # 工具函数
├── prisma/               # 数据库模式
├── public/               # 静态资源
└── protection/           # 安全保护系统
```

## 🌍 多语言实现

### 支持的语言
| 语言 | 代码 | 路由前缀 | 状态 |
|------|------|----------|------|
| English | en | / (默认) | ✅ |
| 中文 | zh | /zh | ✅ |
| Español | es | /es | ✅ |
| 日本語 | ja | /ja | ✅ |
| 한국어 | ko | /ko | ✅ |
| Français | fr | /fr | ✅ |
| Deutsch | de | /de | ✅ |
| Português | pt | /pt | ✅ |
| Русский | ru | /ru | ✅ |
| العربية | ar | /ar | ✅ |

### 本地化功能
- 🔄 **动态语言切换**
- 🔗 **本地化链接生成**
- 📱 **语言检测和重定向**
- 🎯 **SEO友好的URL**

## 🔧 API端点

### 认证
- `POST /api/auth/signup` - 用户注册
- `GET/POST /api/auth/[...nextauth]` - NextAuth回调

### 图片生成
- `POST /api/generate` - AI图片生成
- `GET /api/gallery` - 图片画廊
- `POST /api/gallery/[id]/like` - 点赞图片

### 用户
- `GET /api/user/history` - 生成历史
- `DELETE /api/user/history/[id]` - 删除历史记录

### 多语言
- `GET /api/translations` - 获取翻译文本

## 🚀 部署指南

### Vercel部署

1. **准备环境变量**
   - 在Vercel仪表板添加所有环境变量
   - 配置生产数据库（推荐Neon或PlanetScale）

2. **部署到Vercel**
```bash
npm run deploy:vercel
```

3. **部署后验证**
   - 检查所有语言版本
   - 测试AI图片生成功能
   - 验证用户认证流程

### 环境变量清单
```env
DATABASE_URL=           # PostgreSQL数据库URL
NEXTAUTH_SECRET=        # NextAuth密钥
NEXTAUTH_URL=          # 生产域名
GOOGLE_CLIENT_ID=      # Google OAuth客户端ID
GOOGLE_CLIENT_SECRET=  # Google OAuth客户端密钥
FAL_KEY=              # Fal AI API密钥
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 类型检查
npm run type-check

# 代码格式检查
npm run lint

# 构建测试
npm run build
```

## 📈 性能优化

### 已实现优化
- ✅ **图片优化** - Next.js Image组件
- ✅ **代码分割** - 动态导入和路由级分割
- ✅ **静态生成** - 预渲染静态页面
- ✅ **字体优化** - 本地字体文件
- ✅ **缓存策略** - API响应缓存

### 监控指标
- 🎯 **Lighthouse得分** > 90
- ⚡ **FCP** < 1.5s
- 📱 **移动友好性** 100%

## 🔒 安全特性

### 实现的安全措施
- 🛡️ **输入验证** - Zod schema验证
- 🔐 **密码加密** - bcrypt加密
- 🚫 **XSS防护** - Content Security Policy
- 🔒 **CSRF保护** - NextAuth内置保护
- 📝 **速率限制** - API访问限制

### 文件保护系统
项目包含完整的文件保护系统：
- 文件完整性检查
- 自动备份恢复
- 构建前验证
- 恶意修改检测

## 📊 分析和监控

### 集成工具
- **PostHog** - 用户行为分析
- **Sentry** - 错误监控
- **Vercel Analytics** - 性能监控

## 🤝 贡献指南

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

### 开发规范
- ✅ TypeScript严格模式
- ✅ ESLint代码检查
- ✅ Prettier代码格式化
- ✅ 提交信息规范（Conventional Commits）

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Fal AI](https://fal.ai/) - AI图片生成服务
- [shadcn/ui](https://ui.shadcn.com/) - 精美的UI组件
- [Lucide Icons](https://lucide.dev/) - 现代图标库
- [Next.js团队](https://nextjs.org/) - 优秀的React框架

## 📞 联系我们

- 🌐 **网站**: [sybau-picture.com](https://sybau-picture.com)
- 📧 **邮箱**: support@sybau-picture.com
- 🐦 **Twitter**: [@SybauPicture](https://twitter.com/SybauPicture)
- 💬 **Discord**: [加入我们的社区](https://discord.gg/sybau)

---

<div align="center">
  <p>用 ❤️ 和 ☕ 在中国制作</p>
  <p>如果这个项目对你有帮助，请给我们一个 ⭐</p>
</div>
