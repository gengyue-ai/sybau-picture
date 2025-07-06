# 🔐 Google OAuth 配置指南

## 📋 概述

本指南将帮助您配置 Google OAuth 登录功能。

## 🚀 快速设置步骤

### 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击 "新建项目"
3. 输入项目名称：`Sybau Picture`
4. 点击 "创建"

### 2. 启用 Google+ API

1. 在 Google Cloud Console 中，转到 "API 和服务" → "库"
2. 搜索 "Google+ API"
3. 点击 "启用"

### 3. 创建 OAuth 客户端

1. 转到 "API 和服务" → "凭据"
2. 点击 "创建凭据" → "OAuth 客户端 ID"
3. 选择应用类型：`Web 应用程序`
4. 名称：`Sybau Picture Web Client`
5. 授权的重定向 URI：
   - 开发环境：`http://localhost:3000/api/auth/callback/google`
   - 生产环境：`https://yourdomain.com/api/auth/callback/google`
6. 点击 "创建"

### 4. 配置环境变量

1. 复制客户端 ID 和客户端密钥
2. 编辑 `.env.local` 文件：

```env
# Google OAuth配置
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 5. 生成 NEXTAUTH_SECRET

运行以下命令生成密钥：

```bash
openssl rand -base64 32
```

或者使用在线工具：https://generate-secret.now.sh/32

### 6. 重启开发服务器

```bash
npm run dev
```

## 🔧 故障排除

### 常见问题

1. **"客户端不存在"错误**
   - 检查 `GOOGLE_CLIENT_ID` 是否正确设置
   - 确保没有多余的空格或引号

2. **重定向 URI 不匹配**
   - 确保 Google Console 中的重定向 URI 与应用 URL 匹配
   - 开发环境使用 `http://localhost:3000/api/auth/callback/google`

3. **权限范围问题**
   - 确保 Google+ API 已启用
   - 检查 OAuth 同意屏幕配置

### 验证配置

运行以下命令验证配置：

```bash
node scripts/test-oauth-config.js
```

## 🌐 生产环境配置

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量
2. 更新 Google Console 中的重定向 URI
3. 设置 `NEXTAUTH_URL` 为生产域名

### 域名更新

在 Google Cloud Console 中添加您的生产域名：

- 授权的 JavaScript 源：`https://yourdomain.com`
- 授权的重定向 URI：`https://yourdomain.com/api/auth/callback/google`

## 📝 完整配置示例

```env
# 数据库配置
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Google OAuth配置
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz123456"

# 其他配置...
```

## ✅ 验证成功

配置成功后，您应该能够：

1. 在登录页面看到 "使用 Google 登录" 按钮
2. 点击后跳转到 Google 授权页面
3. 授权后自动登录并返回应用
4. 在导航栏看到用户头像和登出选项

## 🎯 下一步

配置完成后，建议：

1. 测试登录和登出功能
2. 配置其他环境变量（数据库、Stripe等）
3. 部署到生产环境
