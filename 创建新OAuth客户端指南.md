# 🔧 重新创建Google OAuth客户端指南

## 🎯 为什么需要重新创建？

诊断显示当前OAuth客户端有配置冲突，重新创建是最可靠的解决方案。

## 📋 详细步骤

### 第1步：删除现有OAuth客户端
1. 登录 [Google Cloud Console](https://console.cloud.google.com)
2. 导航到 **APIs & Services > Credentials**
3. 找到现有的OAuth 2.0客户端ID
4. 点击右侧的删除按钮（垃圾桶图标）
5. 确认删除

### 第2步：创建新的OAuth客户端
1. 在Credentials页面，点击 **"+ CREATE CREDENTIALS"**
2. 选择 **"OAuth 2.0 Client IDs"**
3. 如果提示配置OAuth同意屏幕，先完成配置：
   - Application type: **External**
   - Application name: **Sybau Picture**
   - User support email: 您的邮箱
   - Developer contact information: 您的邮箱
   - 保存并继续

### 第3步：配置OAuth客户端
1. Application type: 选择 **"Web application"**
2. Name: 输入 **"Sybau Picture Web Client"**
3. Authorized JavaScript origins:
   ```
   https://www.sybaupicture.com
   https://sybaupicture.com
   ```
4. Authorized redirect URIs:
   ```
   https://www.sybaupicture.com/api/auth/callback/google
   https://sybaupicture.com/api/auth/callback/google
   ```
5. 点击 **"CREATE"**

### 第4步：获取新的凭据
1. 创建成功后，会显示客户端ID和客户端密钥
2. **重要**：复制这两个值，稍后需要更新环境变量

### 第5步：更新环境变量
将新的客户端ID和密钥更新到以下文件：
- `.env`
- `.env.production`
- Vercel环境变量（如果直接在Vercel设置）

### 第6步：重新部署
```bash
vercel --prod
```

## ⚠️ 重要提醒

1. **客户端ID格式**：必须以数字开头，以`.apps.googleusercontent.com`结尾
2. **重定向URI**：必须完全匹配，包括协议(https)和路径
3. **域名验证**：确保域名已在Google Console中验证
4. **生效时间**：新配置可能需要5-10分钟生效

## 🔍 验证新配置

创建完成后，测试：
```
https://www.sybaupicture.com/api/auth/signin/google
```

应该重定向到Google登录页面，不再出现错误。

## 📞 如果仍有问题

如果重新创建后仍有问题，可能需要：
1. 检查Google Cloud项目是否启用了相关API
2. 确认项目配额是否充足
3. 联系Google Cloud支持
