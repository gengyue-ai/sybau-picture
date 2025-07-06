# 🔐 Google OAuth 配置完整指南

## 🎯 解决问题
修复Google OAuth认证时的404错误

## 📋 当前问题
- ❌ Google Client ID/Secret 未配置
- ❌ NEXTAUTH_URL 配置错误
- ❌ NEXTAUTH_SECRET 未设置
- ❌ 缺少NextAuth API路由（已修复）

## 🔧 Step 1: 在Google Console创建OAuth应用

### 1.1 访问Google Cloud Console
1. 前往 [Google Cloud Console](/https://console.cloud.google.com)
2. 登录您的Google账户
3. 创建新项目或选择现有项目

### 1.2 启用APIs
1. 在左侧菜单中选择 **"APIs & Services"** -> **"Library"**
2. 搜索并启用 **"Google+ API"**
3. 搜索并启用 **"Google People API"**

### 1.3 创建OAuth凭据
1. 转到 **"APIs & Services"** -> **"Credentials"**
2. 点击 **"CREATE CREDENTIALS"** -> **"OAuth client ID"**
3. 如果是第一次，需要配置OAuth consent screen：
   - 选择 **"External"** 用户类型
   - 填写应用名称：`Sybau Picture`
   - 填写用户支持邮箱
   - 填写开发者联系信息
   - 添加测试用户邮箱（您的邮箱）

### 1.4 配置OAuth Client
1. 应用程序类型：**"Web application"**
2. 名称：`Sybau Picture Web Client`
3. 授权的重定向URI：
   ```
   http://localhost:3001/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google
   ```

### 1.5 获取凭据
创建完成后，您会得到：
- **客户端ID**（Client ID）
- **客户端密钥**（Client Secret）

## 🔧 Step 2: 更新环境变量

### 2.1 编辑 .env.local 文件
添加或更新以下配置：

```bash
# Google OAuth配置
GOOGLE_CLIENT_ID="您的Google客户端ID"
GOOGLE_CLIENT_SECRET="您的Google客户端密钥"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="您的NextAuth密钥"

# 为生产环境准备
# NEXTAUTH_URL="https://your-domain.com"
```

### 2.2 生成NEXTAUTH_SECRET
```bash
# 方法1：使用openssl
openssl rand -base64 32

# 方法2：使用Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法3：在线生成
# 访问 https://generate-secret.vercel.app/32
```

## 🧪 Step 3: 测试配置

### 3.1 重启开发服务器
```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 3.2 测试OAuth流程
1. 访问：`http://localhost:3001/auth/signin`
2. 点击Google登录按钮
3. 应该跳转到Google认证页面
4. 完成认证后返回您的应用

## 🚨 常见问题解决

### 问题1：redirect_uri_mismatch
**错误**：重定向URI不匹配
**解决**：确保Google Console中的重定向URI与实际URL完全匹配

### 问题2：access_denied
**错误**：访问被拒绝
**解决**：检查OAuth consent screen配置，确保添加了测试用户

### 问题3：unauthorized_client
**错误**：未授权的客户端
**解决**：确保Client ID和Secret正确配置

## 🔍 Step 4: 调试工具

### 4.1 检查环境变量
```bash
node -e "require('dotenv').config({path: '.env.local'}); console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '已设置' : '未设置'); console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);"
```

### 4.2 查看NextAuth调试信息
在`.env.local`中添加：
```bash
NEXTAUTH_DEBUG=true
```

### 4.3 检查API路由
访问：`http://localhost:3001/api/auth/providers`
应该返回配置的认证提供商列表

## ✅ 配置完成检查清单

- [ ] Google Cloud项目已创建
- [ ] Google+ API和People API已启用
- [ ] OAuth consent screen已配置
- [ ] OAuth客户端已创建
- [ ] 重定向URI已正确配置
- [ ] GOOGLE_CLIENT_ID已设置
- [ ] GOOGLE_CLIENT_SECRET已设置
- [ ] NEXTAUTH_URL已正确设置
- [ ] NEXTAUTH_SECRET已生成并设置
- [ ] 开发服务器已重启
- [ ] Google登录流程测试成功

## 🎯 生产环境配置

部署到生产环境时，记得：
1. 更新Google Console中的重定向URI
2. 更新NEXTAUTH_URL为生产域名
3. 将OAuth consent screen发布为生产版本
4. 确保所有环境变量在生产环境中正确配置

## 📞 需要帮助？

如果仍有问题：
1. 检查浏览器开发者工具的Network标签
2. 查看终端中的错误日志
3. 访问Google Cloud Console的错误日志
4. 确认所有步骤都已正确完成
