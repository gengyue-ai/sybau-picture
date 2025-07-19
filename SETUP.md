# 🚀 Sybau Picture - AI-Proof 快速设置指南

## ⚡ 5分钟快速开始

### 1. 初始化环境保护系统
```bash
# 首次运行 - 初始化AI保护
npm run env:protect:init
```

### 2. 配置开发环境变量
编辑 `.env.development.local` 文件：
```bash
# 复制以下内容并填入你的实际配置
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3001

# 数据库 - 使用你的本地PostgreSQL或开发用Supabase
DATABASE_URL=postgresql://user:pass@localhost:5432/sybau_dev

# Google OAuth - 开发环境
GOOGLE_CLIENT_ID=your-dev-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-dev-secret

# Stripe 测试环境
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret

# AI服务
FAL_KEY=your-fal-api-key

# NextAuth密钥
NEXTAUTH_SECRET=your-super-long-secret-key
```

### 3. 验证配置
```bash
# 完整环境验证
npm run env:verify

# 如果验证失败，检查上述配置是否正确
```

### 4. 启动开发服务器
```bash
# 智能启动（推荐）
npm run start:smart

# 或标准启动
npm run dev
```

## 🔒 AI保护系统使用

### 日常开发命令
```bash
# 开发前检查
npm run env:check                   # 快速环境检查

# 保护系统维护
npm run env:protect:backup          # 备份环境文件
npm run env:protect:verify          # 验证文件完整性

# 紧急恢复
npm run env:protect:restore         # 从备份恢复环境文件
```

### 当环境被AI破坏时
```bash
# 1. 立即恢复
npm run env:protect:restore

# 2. 验证恢复结果
npm run env:verify

# 3. 重新保存校验和
npm run env:protect:save
```

## 🚀 生产环境部署

### Vercel环境变量配置
在 Vercel Dashboard 中配置以下环境变量：

```bash
# 基础配置
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret

# 数据库（生产）
DATABASE_URL=postgresql://user:pass@prod-host:5432/sybau_prod

# Google OAuth（生产）
GOOGLE_CLIENT_ID=your-prod-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-prod-secret

# Stripe（生产）
STRIPE_SECRET_KEY=sk_live_your_production_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# AI服务
FAL_KEY=your-fal-api-key
```

### 部署流程
```bash
# 1. 本地验证
npm run env:verify
npm run build

# 2. 部署
vercel --prod

# 3. 部署后测试
# - 访问生产URL
# - 测试Google OAuth登录
# - 测试Stripe支付
# - 测试AI图片生成
```

## 🛡️ 安全最佳实践

### 环境变量安全
1. **开发环境**：使用测试密钥，数据与生产隔离
2. **生产环境**：在Vercel中配置，不在代码中存储
3. **备份保护**：定期运行 `npm run env:protect:backup`
4. **AI防护**：严禁AI修改 `.env.development.local` 文件

### 数据库安全
1. **开发**：使用独立的开发数据库
2. **生产**：使用Supabase等托管服务
3. **备份**：定期备份生产数据

### 支付安全
1. **测试**：使用Stripe测试密钥和测试卡号
2. **生产**：使用Stripe生产密钥
3. **Webhook**：配置正确的webhook端点

## 📋 常见问题

### Q: 环境验证失败怎么办？
```bash
# 查看详细错误信息
npm run env:verify

# 检查具体配置问题
npm run env:status

# 恢复环境文件
npm run env:protect:restore
```

### Q: 支付功能不工作？
1. 检查Stripe密钥是否正确
2. 确认Webhook配置
3. 验证价格ID配置
```bash
# 验证支付配置
npm run stripe:verify
```

### Q: 用户头像不显示？
1. 检查Google OAuth配置
2. 验证数据库连接
3. 检查认证回调设置

### Q: 部署到Vercel失败？
1. 确认所有环境变量在Vercel中配置
2. 检查构建是否成功
3. 验证域名配置

## 🔧 开发工具

### 有用的脚本
```bash
# 数据库管理
npm run db:studio                   # 打开Prisma Studio
npm run db:generate                 # 生成Prisma客户端
npm run db:push                     # 推送模式变更

# 类型检查和代码质量
npm run type-check                  # TypeScript检查
npm run lint                        # ESLint检查

# 测试
npm run test                        # 运行测试
npm run test:e2e                    # 端到端测试
```

## 📞 获取帮助

如果遇到问题：
1. 查看 `CLAUDE.md` 中的详细文档
2. 运行 `npm run env:verify` 检查配置
3. 使用 `npm run env:protect:restore` 恢复环境

---

**重要提醒**：此项目使用AI-Proof环境管理系统，严禁AI修改环境配置文件！