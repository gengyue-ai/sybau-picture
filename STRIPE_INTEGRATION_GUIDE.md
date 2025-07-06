# 🚀 Stripe真实支付集成完整指南

## 📋 前置条件
- ✅ Stripe账户已创建
- ✅ 项目已部署到生产环境
- ✅ 域名已配置（用于webhook）
- ✅ SSL证书已配置

## 🔧 Step 1: 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/sybau_picture"

# NextAuth配置
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Stripe配置
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Stripe价格ID
STRIPE_PRICE_STANDARD_MONTHLY="price_your-standard-monthly-price-id"
STRIPE_PRICE_STANDARD_YEARLY="price_your-standard-yearly-price-id"
STRIPE_PRICE_PRO_MONTHLY="price_your-pro-monthly-price-id"
STRIPE_PRICE_PRO_YEARLY="price_your-pro-yearly-price-id"

# 应用基础配置
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# FAL AI配置
FAL_API_KEY="your-fal-api-key"
```

## 🏪 Step 2: 在Stripe Dashboard创建产品和价格

### 2.1 创建产品
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 点击左侧菜单 "产品" -> "添加产品"

#### Standard套餐
- **产品名称**: "Sybau Picture - Standard Plan"
- **描述**: "Standard subscription for Sybau Picture AI generation"
- **价格设置**:
  - 月付: $9.00 USD, 重复周期: 每月
  - 年付: $90.00 USD, 重复周期: 每年 (节省17%)

#### Pro套餐
- **产品名称**: "Sybau Picture - Pro Plan"
- **描述**: "Professional subscription for Sybau Picture AI generation"
- **价格设置**:
  - 月付: $19.00 USD, 重复周期: 每月
  - 年付: $190.00 USD, 重复周期: 每年 (节省17%)

### 2.2 复制价格ID
创建产品后，复制每个价格的ID（格式: `price_xxxxxx`），并更新环境变量。

## 🔗 Step 3: 配置Webhook

### 3.1 创建Webhook端点
1. 在Stripe Dashboard中，点击 "开发者" -> "Webhooks"
2. 点击 "添加端点"
3. 填写信息：
   - **端点URL**: `https://your-domain.com/api/webhook/stripe`
   - **描述**: "Sybau Picture Webhook"

### 3.2 选择事件类型
选择以下事件：
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 3.3 获取Webhook密钥
创建webhook后，复制 "签名密钥"（格式: `whsec_xxxxxx`）并更新环境变量。

## 🚀 Step 4: 部署配置

### 4.1 Vercel部署
1. 在Vercel Dashboard中找到项目
2. 进入 "Settings" -> "Environment Variables"
3. 添加所有环境变量（生产环境）
4. 重新部署项目

### 4.2 数据库配置
```bash
# 推送数据库schema
npx prisma db push

# 运行种子数据
npx prisma db seed
```

## 🧪 Step 5: 测试支付流程

### 5.1 测试环境
使用测试卡号：
- **成功支付**: 4242 4242 4242 4242
- **失败支付**: 4000 0000 0000 0002
- **需要验证**: 4000 0027 6000 3184

### 5.2 生产环境
使用真实银行卡进行小额测试。

## 🔧 Step 6: 监控和维护

### 6.1 监控支付状态
- Stripe Dashboard -> "支付"
- 检查webhook事件日志
- 监控订阅状态

### 6.2 日志检查
```bash
# 检查Vercel函数日志
vercel logs

# 检查数据库连接
npx prisma studio
```

## 🎯 Step 7: 功能验证清单

### 支付流程
- [ ] 用户可以选择套餐
- [ ] 支付页面正常加载
- [ ] 支付成功后正确跳转
- [ ] 订阅状态正确更新
- [ ] 用户权限正确变更

### Webhook处理
- [ ] 订阅创建事件正确处理
- [ ] 支付成功事件正确处理
- [ ] 订阅取消事件正确处理
- [ ] 支付失败事件正确处理

### 用户体验
- [ ] 支付成功页面显示正确
- [ ] 用户可以管理订阅
- [ ] 取消订阅功能正常
- [ ] 升级/降级功能正常

## 🔐 Step 8: 安全配置

### 8.1 环境变量保护
- 确保 `.env.local` 不被提交到Git
- 使用不同的密钥区分测试和生产环境

### 8.2 Webhook安全
- 验证所有webhook签名
- 使用HTTPS端点
- 设置合适的超时时间

## 🚨 故障排除

### 常见问题
1. **支付失败**
   - 检查API密钥是否正确
   - 确认价格ID是否存在
   - 检查网络连接

2. **Webhook未触发**
   - 确认端点URL正确
   - 检查SSL证书
   - 查看事件日志

3. **订阅状态不更新**
   - 检查数据库连接
   - 确认webhook事件处理
   - 查看错误日志

### 调试命令
```bash
# 本地测试webhook
stripe listen --forward-to localhost:3000/api/webhook/stripe

# 查看Stripe事件
stripe events list

# 测试API连接
stripe customers list --limit 1
```

## 📚 相关资源

- [Stripe API文档](https://stripe.com/docs/api)
- [Stripe Webhook指南](https://stripe.com/docs/webhooks)
- [Next.js部署指南](https://nextjs.org/docs/deployment)
- [Vercel环境变量](https://vercel.com/docs/environment-variables)

---

## 🎉 完成！

按照以上步骤配置后，您的Sybau Picture项目将具备完整的Stripe支付功能：

- 💳 安全的信用卡支付
- 🔄 自动订阅管理
- 📊 实时支付状态更新
- 🎯 基于套餐的功能限制
- 📈 支付分析和报告

**需要帮助？** 请检查Stripe Dashboard中的日志和事件，或查看应用的错误日志。
