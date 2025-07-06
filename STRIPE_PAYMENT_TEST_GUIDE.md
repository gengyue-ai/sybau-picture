# 💳 Stripe支付测试完整指南

## 📊 当前配置状态

### ✅ 已配置正确
- **Secret Key**: `sk_live_` (生产环境)
- **Publishable Key**: `pk_live_` (生产环境)
- **基础价格ID**: 已配置两个套餐

### ❌ 需要修复的问题
- **Webhook Secret**: 格式不正确（当前: `rk_live_`, 需要: `whsec_`）
- **完整价格体系**: 缺少月费/年费选项

---

## 🔧 第1步：修复Webhook Secret

### 方法1：创建新的Webhook端点

1. **访问Stripe Dashboard**
   ```
   https://dashboard.stripe.com/webhooks
   ```

2. **创建新端点**
   - 点击 "Add endpoint"
   - 输入端点URL: `https://your-domain.vercel.app/api/webhook/stripe`
   - 选择事件类型：
     ```
     ✅ checkout.session.completed
     ✅ customer.subscription.created
     ✅ customer.subscription.updated
     ✅ customer.subscription.deleted
     ✅ invoice.payment_succeeded
     ✅ invoice.payment_failed
     ```

3. **获取签名密钥**
   - 创建后点击webhook端点
   - 复制 "Signing secret" (格式: `whsec_...`)
   - 更新环境变量

### 方法2：使用测试模式（推荐先测试）

1. **切换到测试模式**
   - 在Stripe Dashboard中点击 "测试模式"
   - 创建测试webhook端点
   - 使用 `http://localhost:3001/api/webhook/stripe` 进行本地测试

---

## 🚀 第2步：本地测试支付流程

### 安装Stripe CLI（推荐）

1. **安装Stripe CLI**
   ```bash
   # Windows (使用Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # 或者下载exe文件
   # https://github.com/stripe/stripe-cli/releases
   ```

2. **登录Stripe CLI**
   ```bash
   stripe login
   ```

3. **转发Webhook到本地**
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook/stripe
   ```

   这会给您一个临时的webhook secret，类似：
   ```
   whsec_1234567890abcdef...
   ```

4. **更新本地环境变量**
   ```bash
   # 在 .env.local 中更新
   STRIPE_WEBHOOK_SECRET="whsec_1234567890abcdef..."
   ```

### 启动本地服务器测试

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **在另一个终端启动Stripe监听**
   ```bash
   stripe listen --forward-to localhost:3001/api/webhook/stripe
   ```

3. **使用测试卡号**
   ```
   成功支付: 4242 4242 4242 4242
   失败支付: 4000 0000 0000 0002
   需要验证: 4000 0025 0000 3155
   ```

---

## 🧪 第3步：测试支付流程

### 基础支付测试

1. **访问定价页面**
   ```
   http://localhost:3001/pricing
   ```

2. **点击订阅按钮**
   - 选择基础版或专业版
   - 检查是否正确跳转到Stripe结账页面

3. **填写测试信息**
   ```
   卡号: 4242 4242 4242 4242
   有效期: 任意未来日期 (如 12/25)
   CVC: 任意3位数字 (如 123)
   邮箱: test@example.com
   ```

4. **完成支付**
   - 点击 "Subscribe"
   - 观察Stripe CLI输出的webhook事件
   - 检查是否正确重定向到成功页面

### 高级测试场景

1. **订阅管理测试**
   ```bash
   # 测试订阅创建
   # 测试订阅更新
   # 测试订阅取消
   ```

2. **失败支付测试**
   ```bash
   # 使用失败卡号: 4000 0000 0000 0002
   # 检查错误处理
   ```

3. **Webhook事件检查**
   ```bash
   # 在Stripe CLI中观察事件
   # 检查数据库中的订阅记录
   ```

---

## 📋 测试检查清单

### 基础功能测试
- [ ] 定价页面加载正常
- [ ] 订阅按钮工作正常
- [ ] Stripe结账页面正确显示价格
- [ ] 测试支付成功完成
- [ ] 支付成功后正确重定向
- [ ] Webhook事件正确接收和处理

### 数据库检查
- [ ] 用户订阅记录正确创建
- [ ] 支付记录正确保存
- [ ] 订阅状态正确更新

### 错误处理测试
- [ ] 支付失败时显示错误信息
- [ ] 网络错误时正确处理
- [ ] 无效数据时正确验证

---

## 🐛 常见问题及解决方案

### 问题1：Webhook Secret格式错误
```
错误: STRIPE_WEBHOOK_SECRET 格式不正确
解决: 确保使用 whsec_ 开头的签名密钥
```

### 问题2：本地测试无法接收Webhook
```
错误: 本地服务器无法接收Stripe事件
解决: 使用 stripe listen --forward-to localhost:3001/api/webhook/stripe
```

### 问题3：支付后重定向失败
```
错误: 支付成功但页面跳转错误
解决: 检查 success_url 和 cancel_url 配置
```

### 问题4：数据库记录未创建
```
错误: 支付成功但数据库无记录
解决: 检查 webhook 处理逻辑和数据库连接
```

---

## 🔍 调试技巧

### 1. 查看Stripe CLI日志
```bash
stripe listen --forward-to localhost:3001/api/webhook/stripe
```

### 2. 检查浏览器网络面板
- 查看API请求是否成功
- 检查错误响应内容

### 3. 查看服务器日志
```bash
# 在开发服务器终端中查看日志
npm run dev
```

### 4. 使用Stripe Dashboard
- 查看支付记录
- 检查webhook事件日志
- 查看客户和订阅数据

---

## 🚀 部署后的生产测试

### 1. 更新Webhook端点
```
生产URL: https://your-app.vercel.app/api/webhook/stripe
```

### 2. 使用真实测试卡
```
仍然使用测试卡号，但在生产环境中测试
```

### 3. 监控生产Webhook
```
在Stripe Dashboard中监控生产环境的webhook事件
```

---

## 📞 下一步操作建议

### 立即可以做的：
1. **安装Stripe CLI**
2. **启动本地webhook监听**
3. **使用测试卡号测试支付**
4. **检查webhook事件接收**

### 部署前需要完成的：
1. **修复webhook secret格式**
2. **测试完整支付流程**
3. **验证数据库记录创建**

### 部署后需要做的：
1. **创建生产环境webhook端点**
2. **使用真实测试卡测试**
3. **监控生产支付流程**

---

## 🎯 立即开始测试

运行以下命令开始测试：

```bash
# 1. 安装Stripe CLI (如果还没有)
# 2. 启动本地开发服务器
npm run dev

# 3. 在新终端中启动Stripe监听 (需要先安装Stripe CLI)
stripe listen --forward-to localhost:3001/api/webhook/stripe

# 4. 访问定价页面开始测试
# http://localhost:3001/pricing
```

需要我帮您执行这些步骤吗？
