# 🔗 Stripe Dashboard Webhook端点创建指南

## 🎯 创建步骤

### 第1步：登录Stripe Dashboard
1. 访问 **https://dashboard.stripe.com/**
2. 登录您的Stripe账户
3. 确保您在正确的模式（测试模式或生产模式）

### 第2步：进入Webhook设置
1. 在左侧菜单中找到 **"开发者"** (Developers)
2. 点击 **"Webhooks"**
3. 点击 **"添加端点"** (Add endpoint) 按钮

### 第3步：配置Webhook端点

#### 📍 端点URL配置
根据您的需求选择：

**选项A：本地测试**
```
端点URL: http://localhost:3001/api/webhook/stripe
```

**选项B：生产环境（部署到Vercel后）**
```
端点URL: https://your-app-name.vercel.app/api/webhook/stripe
```

#### 📋 事件类型选择
在 "Select events" 部分，选择以下事件：

**必需事件**：
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

**推荐附加事件**：
- ✅ `customer.created`
- ✅ `customer.updated`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

### 第4步：保存并获取签名密钥
1. 点击 **"Add endpoint"** 保存配置
2. 创建后，点击刚创建的webhook端点
3. 在端点详情页面，找到 **"Signing secret"** 部分
4. 点击 **"Reveal"** 显示签名密钥
5. 复制签名密钥（格式：`whsec_...`）

---

## 🔧 更新环境变量

### 获取签名密钥后，更新您的环境变量：

**本地开发环境**：
```bash
# 在 .env.local 文件中更新
STRIPE_WEBHOOK_SECRET="whsec_您复制的签名密钥"
```

**Vercel生产环境**：
1. 在Vercel Dashboard中进入您的项目
2. 点击 "Settings" -> "Environment Variables"
3. 更新 `STRIPE_WEBHOOK_SECRET` 变量

---

## 📸 详细截图指南

### 1. 找到Webhook设置
```
Dashboard -> 开发者 -> Webhooks -> 添加端点
```

### 2. 配置端点URL
```
端点URL: [您的域名]/api/webhook/stripe
描述: Sybau Picture Payment Webhooks
```

### 3. 选择事件类型
```
搜索并选择以下事件：
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

### 4. 获取签名密钥
```
创建后 -> 点击webhook端点 -> 复制 Signing secret
```

---

## 🧪 测试Webhook

### 使用Stripe CLI测试（推荐）
```bash
# 1. 登录Stripe CLI
stripe login

# 2. 测试webhook端点
stripe listen --forward-to localhost:3001/api/webhook/stripe

# 3. 触发测试事件
stripe trigger checkout.session.completed
```

### 手动测试
1. 启动本地开发服务器：`npm run dev`
2. 访问定价页面：`http://localhost:3001/pricing`
3. 使用测试卡号完成支付：`4242 4242 4242 4242`
4. 检查webhook事件是否正确接收

---

## 🔍 验证配置

### 检查webhook状态
1. 在Stripe Dashboard中查看webhook端点
2. 检查 "Recent deliveries" 部分
3. 确保事件正确发送和接收

### 验证签名密钥格式
```bash
# 正确格式
whsec_1234567890abcdef...

# 错误格式（当前的格式）
rk_live_1234567890abcdef...
```

---

## 🚨 常见问题及解决方案

### 问题1：端点URL无法访问
**解决方案**：
- 本地测试：确保开发服务器正在运行
- 生产环境：确保域名正确且应用已部署

### 问题2：事件接收失败
**解决方案**：
- 检查API路由文件是否存在：`app/api/webhook/stripe/route.ts`
- 检查签名密钥是否正确配置

### 问题3：签名验证失败
**解决方案**：
- 确保使用正确的签名密钥（`whsec_`开头）
- 检查环境变量是否正确设置

---

## 🎯 推荐的创建顺序

### 立即操作（本地测试）：
1. **创建测试模式webhook**
   - 端点URL：`http://localhost:3001/api/webhook/stripe`
   - 获取测试签名密钥
   - 更新本地环境变量

2. **启动本地服务器测试**
   ```bash
   npm run dev
   ```

3. **进行支付测试**
   - 访问：`http://localhost:3001/pricing`
   - 使用测试卡号：`4242 4242 4242 4242`

### 部署后操作（生产环境）：
1. **部署到Vercel**
   ```bash
   npx vercel --prod
   ```

2. **创建生产模式webhook**
   - 端点URL：`https://your-app.vercel.app/api/webhook/stripe`
   - 获取生产签名密钥
   - 更新Vercel环境变量

---

## 📞 需要帮助？

如果您在创建过程中遇到任何问题，请告诉我：
1. 具体在哪一步遇到问题
2. 错误信息是什么
3. 您当前的配置状态

我会立即为您提供解决方案！
