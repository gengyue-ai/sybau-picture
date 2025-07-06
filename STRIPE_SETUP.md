# Stripe 支付集成配置说明

## 🎯 集成完成状态

✅ **已完成的功能**：
- 完整的Stripe支付SDK集成
- 支付会话创建API
- 客户门户管理
- Webhook事件处理
- 订阅状态管理
- 数据库Schema扩展
- 前端支付流程

## 🔧 配置环境变量

在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```env
# Stripe 配置
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Stripe 价格ID配置
STRIPE_PRICE_STANDARD_MONTHLY="price_your-standard-monthly-price-id"
STRIPE_PRICE_STANDARD_YEARLY="price_your-standard-yearly-price-id"
STRIPE_PRICE_PRO_MONTHLY="price_your-pro-monthly-price-id"
STRIPE_PRICE_PRO_YEARLY="price_your-pro-yearly-price-id"

# 应用基础配置
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📋 Stripe 配置步骤

### 1. 创建 Stripe 账户
- 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
- 注册并验证账户

### 2. 获取 API 密钥
- 在 Stripe Dashboard 中找到 `开发者` -> `API密钥`
- 复制 `可发布密钥` 和 `秘密密钥`

### 3. 创建产品和价格
创建以下产品：

#### Standard 套餐
- 名称：Standard Plan
- 月费：$19.99
- 年费：$199.99 (17% 折扣)

#### Pro 套餐
- 名称：Pro Plan
- 月费：$49.99
- 年费：$499.99 (17% 折扣)

### 4. 配置 Webhook
1. 在 Stripe Dashboard 中找到 `开发者` -> `Webhooks`
2. 点击 `添加端点`
3. 输入端点URL：`https://your-domain.com/api/webhook/stripe`
4. 选择要监听的事件：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 🚀 部署配置

### Vercel 部署
1. 在 Vercel 项目设置中添加环境变量
2. 确保 Webhook URL 指向正确的域名
3. 重新部署应用

### 数据库迁移
```bash
# 更新数据库架构
npx prisma db push

# 运行种子数据
npx prisma db seed
```

## 🔄 支付流程

### 用户支付流程
1. 用户点击套餐购买按钮
2. 系统创建 Stripe 结算会话
3. 用户被重定向到 Stripe 支付页面
4. 支付完成后返回成功页面
5. Webhook 自动更新用户订阅状态

### 订阅管理
- 用户可以在账户设置中管理订阅
- 支持升级/降级套餐
- 支持取消订阅

## 🛠️ 开发工具

### 本地测试 Webhook
```bash
# 安装 Stripe CLI
npm install -g @stripe/stripe-cli

# 登录 Stripe
stripe login

# 监听 Webhook 事件
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### 测试支付
- 使用 Stripe 测试卡号：`4242 4242 4242 4242`
- 过期日期：任意未来日期
- CVC：任意3位数字

## 📊 集成的功能

### 前端功能
- 💳 定价页面支付按钮
- 🔄 支付状态加载动画
- ✅ 支付成功页面
- 📱 响应式设计

### 后端功能
- 🔐 用户认证检查
- 💰 支付会话创建
- 📋 订阅状态管理
- 🎯 使用限制控制
- 📊 使用统计跟踪

### 数据库功能
- 👤 用户套餐关联
- 📈 订阅记录管理
- 📊 使用情况统计
- 💳 Stripe 客户ID存储

## 🎨 UI/UX 特性

### 定价页面
- 📊 套餐对比表格
- 💎 推荐套餐高亮
- 🎯 年付折扣显示
- 🔄 切换月/年付费

### 支付页面
- 🎨 美观的成功页面
- 📱 移动端优化
- 🔄 加载状态指示
- ⚡ 快速跳转链接

## 🔧 故障排除

### 常见问题
1. **支付失败**: 检查 Stripe 密钥配置
2. **Webhook 未触发**: 确认端点URL和事件配置
3. **订阅状态不更新**: 检查数据库连接和权限

### 日志查看
- Stripe Dashboard 中的事件日志
- Vercel 函数日志
- 数据库连接状态

## 📚 相关文档

- [Stripe 文档](https://stripe.com/docs)
- [Next.js 支付集成](https://nextjs.org/docs/app/building-your-application/integrations/payment)
- [Prisma Stripe 集成](https://www.prisma.io/docs/guides/integrations/stripe)

---

🎉 **恭喜！您的 Stripe 支付系统已成功集成！**

现在用户可以：
- 💳 安全地进行在线支付
- 📊 管理自己的订阅
- 🎯 享受基于套餐的功能限制
- 📈 查看使用统计
