
# 认证重定向修复指南

## 修复内容
1. ✅ 统一端口配置为 3001
2. ✅ 修复NextAuth重定向逻辑
3. ✅ 更新callbackUrl配置

## 重启步骤

### 1. 停止当前服务器
- 按 Ctrl+C 停止开发服务器
- 按 Ctrl+C 停止Stripe CLI

### 2. 重新启动服务器
```bash
# 启动开发服务器（现在使用端口3001）
npm run dev

# 在新的终端窗口启动Stripe CLI
D:\stripe\stripe.exe listen --forward-to localhost:3001/api/webhook/stripe
```

### 3. 更新Google OAuth Console
- 访问: https://console.cloud.google.com/apis/credentials
- 确保重定向URI包含: http://localhost:3001/api/auth/callback/google

### 4. 测试流程
1. 访问: http://localhost:3001/pricing
2. 点击"Choose Standard"或"Go PRO"
3. 选择Google登录
4. 登录完成后应该返回到定价页面

## 预期结果
- ✅ 登录后正确返回到定价页面
- ✅ 支付流程正常工作
- ✅ Webhook事件正常接收

## 如果仍有问题
请检查浏览器控制台和开发服务器日志中的错误信息。
