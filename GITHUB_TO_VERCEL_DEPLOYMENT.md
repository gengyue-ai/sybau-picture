# 🚀 GitHub 到 Vercel 部署完整指南

## 📋 前提条件检查

### ✅ 已完成配置
- **数据库**: PostgreSQL (Supabase) 已配置
- **认证**: NextAuth + Google OAuth 已配置
- **支付**: Stripe 完整集成 (webhook + 价格体系)
- **AI功能**: FAL 图片生成已配置
- **多语言**: 10种语言完整支持

---

## 🎯 Vercel 部署步骤

### 第1步：连接GitHub仓库

1. **登录Vercel Dashboard**
   - 访问 https://vercel.com/dashboard
   - 确保您已登录

2. **导入GitHub项目**
   - 点击 "New Project" 或 "Add New..."
   - 选择 "Import Git Repository"
   - 找到您的仓库: `gengyue-ai/sybau-picture`
   - 点击 "Import"

### 第2步：配置项目设置

1. **项目配置**
   - **Project Name**: `sybau-picture` (或您喜欢的名称)
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)

2. **高级设置** (可选)
   - **Node.js Version**: 18.x (推荐)
   - **Install Command**: `npm install` (默认)

### 第3步：配置环境变量

在Vercel Dashboard中，进入 "Environment Variables" 部分，添加以下变量：

#### 🔧 必需的环境变量

```env
# 数据库配置
DATABASE_URL=postgresql://postgres.niqywjbgqkfvuqhngbxm:Funinhand1122@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# NextAuth配置
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth配置
GOOGLE_CLIENT_ID=42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Stripe配置 (使用您的真实密钥)
STRIPE_SECRET_KEY=sk_live_[您的真实Stripe密钥]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[您的真实Stripe公钥]
STRIPE_WEBHOOK_SECRET=whsec_[您的真实Webhook密钥]

# Stripe价格ID
STRIPE_PRICE_STANDARD_MONTHLY=price_1RhROqG6XuFqUG4898GD54ic
STRIPE_PRICE_STANDARD_YEARLY=price_1RhRQBG6XuFqUG48R9UPjFyb
STRIPE_PRICE_PRO_MONTHLY=price_1RhRPSG6XuFqUG48PjjCUHkU
STRIPE_PRICE_PRO_YEARLY=price_1RhRQgG6XuFqUG48RcSOqsAA

# AI功能
FAL_API_KEY=[您的FAL API密钥]
```

#### 📝 环境变量添加方法
1. 在Vercel项目设置中找到 "Environment Variables"
2. 对每个变量：
   - **Name**: 变量名 (如 `DATABASE_URL`)
   - **Value**: 变量值 (实际的连接字符串或密钥)
   - **Environments**: 选择 "Production", "Preview", "Development"
3. 点击 "Save"

### 第4步：部署项目

1. **开始部署**
   - 确认所有配置正确
   - 点击 "Deploy"
   - 等待构建完成 (通常2-5分钟)

2. **监控部署过程**
   - 查看构建日志
   - 确保没有错误
   - 等待 "✅ Deployment completed" 消息

### 第5步：部署后配置

#### 🔧 更新外部服务配置

1. **更新Google OAuth重定向URI**
   - 进入 Google Cloud Console
   - 找到您的OAuth客户端
   - 添加重定向URI: `https://your-app-name.vercel.app/api/auth/callback/google`

2. **配置Stripe生产Webhook**
   - 进入 Stripe Dashboard
   - 创建新的Webhook端点
   - URL: `https://your-app-name.vercel.app/api/webhook/stripe`
   - 复制Webhook Secret并更新Vercel环境变量

#### 🔍 验证部署

1. **基本功能测试**
   - 访问应用主页
   - 测试用户登录 (Google OAuth)
   - 测试语言切换
   - 测试响应式设计

2. **支付功能测试**
   - 访问定价页面
   - 测试订阅流程
   - 验证Webhook接收

3. **AI功能测试**
   - 测试图片生成功能
   - 验证API调用正常

---

## 🛠️ 故障排除

### 常见问题及解决方案

#### 1. 构建失败
**可能原因**:
- 环境变量缺失
- TypeScript类型错误
- 依赖项问题

**解决方案**:
- 检查所有必需的环境变量
- 查看构建日志中的具体错误
- 确保package.json中的依赖项正确

#### 2. 数据库连接失败
**可能原因**:
- DATABASE_URL配置错误
- Supabase连接问题

**解决方案**:
- 验证DATABASE_URL格式正确
- 确保Supabase项目处于活跃状态
- 检查网络连接

#### 3. OAuth登录失败
**可能原因**:
- 重定向URI未更新
- Google OAuth配置错误

**解决方案**:
- 更新Google Cloud Console中的重定向URI
- 确保域名匹配
- 检查NEXTAUTH_URL环境变量

#### 4. 支付功能异常
**可能原因**:
- Stripe密钥错误
- Webhook配置问题

**解决方案**:
- 验证Stripe密钥正确性
- 更新Webhook端点URL
- 检查Webhook Secret

---

## 📊 部署成功检查清单

### ✅ 功能验证
- [ ] 应用主页正常加载
- [ ] Google OAuth登录成功
- [ ] 数据库操作正常
- [ ] 支付流程完整
- [ ] AI图片生成工作
- [ ] 多语言切换正常
- [ ] 移动端适配良好
- [ ] SEO元数据正确

### ✅ 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] Core Web Vitals良好
- [ ] 图片优化生效
- [ ] CDN缓存工作

### ✅ 安全检查
- [ ] HTTPS证书有效
- [ ] 环境变量安全存储
- [ ] API端点保护正常
- [ ] 用户数据加密

---

## 🎉 部署完成

恭喜！您的Sybau Picture应用已成功部署到Vercel。

**应用地址**: https://your-app-name.vercel.app

### 📞 需要帮助？

如果在部署过程中遇到任何问题：

1. **检查构建日志**: 在Vercel Dashboard中查看详细错误信息
2. **验证环境变量**: 确保所有必需的环境变量已正确配置
3. **测试本地构建**: 运行 `npm run build` 确保本地构建成功
4. **查看文档**: 参考项目中的其他部署文档

---

## 🔄 持续部署

### 自动部署设置

Vercel已自动为您配置了持续部署：

- **主分支**: 推送到 `master` 分支将自动触发生产部署
- **功能分支**: 其他分支的推送将创建预览部署
- **Pull Request**: PR将自动生成预览链接

### 域名配置 (可选)

如果您有自定义域名：

1. 在Vercel Dashboard中进入 "Domains"
2. 添加您的域名
3. 按照DNS配置指引操作
4. 等待域名验证完成

---

**🚀 享受您的全新AI图片生成应用！**
