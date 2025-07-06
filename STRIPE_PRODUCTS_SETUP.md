# 🏪 Stripe产品配置详细指南

## 🎯 配置目标
为Sybau Picture创建以下产品和价格：
- Standard套餐：月付$9，年付$90（节省17%）
- Pro套餐：月付$19，年付$190（节省17%）

## 📋 Step 1: 登录Stripe Dashboard

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 使用您的账户登录：panyongqiang805@gmail.com
3. 确认您在测试模式（Test mode）

## 🏷️ Step 2: 创建Standard套餐

### 2.1 创建产品
1. 点击左侧菜单 **"产品"**
2. 点击 **"添加产品"** 按钮
3. 填写产品信息：
   - **名称**: `Sybau Picture - Standard Plan`
   - **描述**: `Standard subscription for Sybau Picture AI generation with 100 images per month`
   - **图片**: 可选，上传套餐图标

### 2.2 配置定价
#### 月付价格
- **价格**: `9.00`
- **货币**: `USD` (美元)
- **计费方式**: `Recurring` (重复)
- **计费间隔**: `Month` (每月)
- **价格描述**: `Standard Monthly`

点击 **"保存"**，复制生成的价格ID（格式：`price_xxxxxxxxx`）

#### 年付价格
- 在同一产品页面，点击 **"添加另一个价格"**
- **价格**: `90.00`
- **货币**: `USD`
- **计费方式**: `Recurring`
- **计费间隔**: `Year` (每年)
- **价格描述**: `Standard Yearly (Save 17%)`

点击 **"保存"**，复制生成的价格ID

## 🚀 Step 3: 创建Pro套餐

### 3.1 创建产品
1. 再次点击 **"添加产品"**
2. 填写产品信息：
   - **名称**: `Sybau Picture - Pro Plan`
   - **描述**: `Professional subscription for Sybau Picture AI generation with unlimited images and priority support`

### 3.2 配置定价
#### 月付价格
- **价格**: `19.00`
- **货币**: `USD`
- **计费方式**: `Recurring`
- **计费间隔**: `Month`
- **价格描述**: `Pro Monthly`

#### 年付价格
- **价格**: `190.00`
- **货币**: `USD`
- **计费方式**: `Recurring`
- **计费间隔**: `Year`
- **价格描述**: `Pro Yearly (Save 17%)`

## 📝 Step 4: 复制价格ID并更新环境变量

您将获得4个价格ID，格式如下：
```
STRIPE_PRICE_STANDARD_MONTHLY="price_1xxxxxxxxx"
STRIPE_PRICE_STANDARD_YEARLY="price_1xxxxxxxxx"
STRIPE_PRICE_PRO_MONTHLY="price_1xxxxxxxxx"
STRIPE_PRICE_PRO_YEARLY="price_1xxxxxxxxx"
```

## 🔧 Step 5: 更新.env.local文件

打开项目根目录的`.env.local`文件，更新价格ID：

```bash
# 更新这些行为您的实际价格ID
STRIPE_PRICE_STANDARD_MONTHLY="price_您的标准月付价格ID"
STRIPE_PRICE_STANDARD_YEARLY="price_您的标准年付价格ID"
STRIPE_PRICE_PRO_MONTHLY="price_您的专业月付价格ID"
STRIPE_PRICE_PRO_YEARLY="price_您的专业年付价格ID"
```

## 🔗 Step 6: 配置Webhook

### 6.1 创建Webhook端点
1. 在Stripe Dashboard中，点击 **"开发者"** -> **"Webhooks"**
2. 点击 **"添加端点"**
3. 填写信息：
   - **端点URL**: `http://localhost:3001/api/webhook/stripe` (本地测试)
   - **描述**: `Sybau Picture Local Webhook`

### 6.2 选择事件
选择以下事件类型：
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 6.3 获取Webhook密钥
1. 创建webhook后，点击进入详情页面
2. 在 **"签名密钥"** 部分，点击 **"显示"**
3. 复制密钥（格式：`whsec_xxxxxxxxx`）
4. 更新`.env.local`中的`STRIPE_WEBHOOK_SECRET`

## 🧪 Step 7: 验证配置

运行验证命令：
```bash
npm run stripe:verify
```

应该显示所有价格ID都有效。

## 🎯 Step 8: 测试支付流程

1. 在浏览器中访问：`http://localhost:3001/pricing`
2. 点击任一套餐的 **"立即购买"** 按钮
3. 应该跳转到Stripe支付页面
4. 使用测试卡号：`4242 4242 4242 4242`
5. 任意有效的过期日期和CVC码
6. 完成支付测试

## ✅ 完成检查清单

- [ ] Standard月付产品已创建
- [ ] Standard年付价格已配置
- [ ] Pro月付产品已创建
- [ ] Pro年付价格已配置
- [ ] 所有价格ID已复制并更新到环境变量
- [ ] Webhook端点已配置
- [ ] Webhook密钥已更新
- [ ] 支付流程测试成功

## 🚀 下一步

配置完成后，您可以：
1. 测试完整的支付流程
2. 配置生产环境的webhook URL
3. 部署到生产环境
4. 切换到Stripe的生产模式

## 📞 需要帮助？

如果遇到问题：
1. 检查Stripe Dashboard中的事件日志
2. 运行 `npm run stripe:verify` 验证配置
3. 查看浏览器控制台的错误信息
4. 检查开发服务器的日志输出
