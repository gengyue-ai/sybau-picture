# 🔧 Google OAuth客户端重新创建步骤

## 🎯 目标
解决 "The OAuth client was not found" 错误

## 📋 当前配置信息
- **旧客户端ID**: `42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com`
- **回调URL**: `https://sybaupicture.com/api/auth/callback/google`
- **项目**: Sybau Picture

---

## 🚀 执行步骤

### **步骤1: 访问Google Cloud Console**
1. 打开浏览器，访问：https://console.cloud.google.com/apis/credentials
2. 确保选择正确的项目（如果有多个项目）
3. 查看当前的OAuth 2.0客户端ID列表

### **步骤2: 删除旧的OAuth客户端**
1. 找到客户端ID：`42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com`
2. 点击该客户端右侧的**删除**按钮（垃圾桶图标）
3. 确认删除操作

### **步骤3: 创建新的OAuth客户端**
1. 点击页面上方的 **+ 创建凭据**
2. 选择 **OAuth 2.0 客户端ID**
3. 如果提示配置OAuth同意屏幕，先完成同意屏幕配置

### **步骤4: 配置新的OAuth客户端**
**应用类型**: 选择 **Web应用**

**名称**: 输入
```
Sybau Picture Production
```

**已获授权的重定向URI**: 添加以下三个URI
```
https://sybaupicture.com/api/auth/callback/google
https://www.sybaupicture.com/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### **步骤5: 保存并获取新凭据**
1. 点击 **创建** 按钮
2. 记录新的客户端ID和客户端密钥
3. 下载JSON文件（可选，作为备份）

### **步骤6: 配置OAuth同意屏幕**
1. 在左侧菜单中选择 **OAuth同意屏幕**
2. 确保以下配置：
   - **用户类型**: 外部
   - **应用名称**: Sybau Picture
   - **用户支持电子邮件**: panyongjiang805@gmail.com
   - **应用主页**: https://sybaupicture.com
   - **隐私权政策链接**: https://sybaupicture.com/privacy
   - **服务条款链接**: https://sybaupicture.com/terms

### **步骤7: 发布应用**
1. 在OAuth同意屏幕页面
2. 点击 **发布应用** 按钮
3. 确认发布状态显示为"已发布"

---

## 🔄 完成后的操作

### **步骤8: 更新本地环境变量**
等待您提供新的客户端ID和密钥后，我会更新本地配置。

### **步骤9: 更新Vercel环境变量**
1. 访问 https://vercel.com/dashboard
2. 找到 sybaupicture 项目
3. 进入 Settings → Environment Variables
4. 更新 GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET
5. 点击 Redeploy

### **步骤10: 测试功能**
1. 等待部署完成
2. 访问 https://sybaupicture.com
3. 测试Google登录功能

---

## 📝 重要提醒

1. **保存凭据**: 请妥善保存新的客户端ID和密钥
2. **发布应用**: 确保应用已发布到生产环境
3. **URI匹配**: 重定向URI必须完全匹配
4. **等待生效**: 配置更改可能需要几分钟生效

---

## 🎯 成功标准
- ✅ 删除旧的OAuth客户端
- ✅ 创建新的OAuth客户端
- ✅ 配置正确的重定向URI
- ✅ 应用已发布到生产环境
- ✅ 更新所有环境变量
- ✅ Google登录功能正常工作

---

**开始执行第一步吧！** 🚀
