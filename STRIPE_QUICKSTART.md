# 🚀 Stripe支付集成快速入门指南

## 🎯 简介
此指南帮助您快速为Sybau Picture项目集成真实的Stripe支付系统。

## 📋 前置条件
- ✅ 已注册Stripe账户
- ✅ 项目已部署到生产环境
- ✅ 已配置域名和SSL证书

## 🔧 快速设置（3步完成）

### Step 1: 运行自动配置脚本
```bash
npm run stripe:setup
```
这个脚本会交互式地收集您的Stripe配置信息并自动生成`.env.local`文件。

### Step 2: 在Stripe Dashboard创建产品
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 创建以下产品：

#### Standard套餐
- 产品名称：`Sybau Picture - Standard Plan`
- 月付价格：$9.00 USD
- 年付价格：$90.00 USD（节省17%）

#### Pro套餐
- 产品名称：`Sybau Picture - Pro Plan`
- 月付价格：$19.00 USD
- 年付价格：$190.00 USD（节省17%）

3. 复制每个价格的ID，更新到环境变量中

### Step 3: 配置Webhook
1. 在Stripe Dashboard中创建Webhook端点
2. 端点URL：`https://your-domain.com/api/webhook/stripe`
3. 选择事件：
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 🧪 测试配置

### 验证配置
```bash
npm run stripe:verify
```

### 本地测试Webhook
```bash
npm run stripe:test
```

### 使用测试卡号
- 成功支付：`4242 4242 4242 4242`
- 失败支付：`4000 0000 0000 0002`
- 需要验证：`4000 0027 6000 3184`

## 🚀 部署

### 更新生产环境变量
1. 在Vercel Dashboard中添加环境变量
2. 使用生产环境的Stripe密钥（`sk_live_`、`pk_live_`）
3. 重新部署应用

### 数据库设置
```bash
npx prisma db push
npx prisma db seed
```

## 📊 监控

### 支付监控
- 在Stripe Dashboard中监控支付状态
- 检查webhook事件日志
- 监控订阅状态变化

### 应用监控
- 检查Vercel函数日志
- 监控数据库连接状态
- 验证用户权限更新

## 🎉 完成！

现在您的Sybau Picture项目已经集成了完整的Stripe支付功能：

- 💳 安全的信用卡支付
- 🔄 自动订阅管理
- 📊 实时支付状态更新
- 🎯 基于套餐的功能限制
- 📈 支付分析和报告

## 📚 相关文档
- [详细集成指南](./STRIPE_INTEGRATION_GUIDE.md)
- [现有设置文档](./STRIPE_SETUP.md)
- [Stripe官方文档](https://stripe.com/docs)

## 🆘 需要帮助？
如果遇到问题，请：
1. 运行 `npm run stripe:verify` 检查配置
2. 查看Stripe Dashboard中的事件日志
3. 检查应用的错误日志
4. 参考详细的集成指南
