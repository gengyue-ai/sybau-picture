# 🚀 立即更新Vercel环境变量（新Google OAuth）

## 🎯 目标
更新Vercel上的Google OAuth配置，修复"客户端未找到"错误

## 📋 新的Google OAuth配置
- **新客户端ID**: `42563097606-k876i2o56atm8ih9ibguijgr358tfkrl.apps.googleusercontent.com`
- **新客户端密钥**: `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`

---

## 🔧 立即执行步骤

### **步骤1: 访问Vercel Dashboard**
1. 打开浏览器，访问：https://vercel.com/dashboard
2. 找到并点击 **sybaupicture** 项目

### **步骤2: 进入环境变量设置**
1. 点击 **Settings** 标签
2. 在左侧菜单中选择 **Environment Variables**

### **步骤3: 更新Google OAuth配置**
找到并更新以下2个变量：

#### **GOOGLE_CLIENT_ID**
- **旧值**: `42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com`
- **新值**: `42563097606-k876i2o56atm8ih9ibguijgr358tfkrl.apps.googleusercontent.com`

#### **GOOGLE_CLIENT_SECRET**
- **旧值**: `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`
- **新值**: `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`

### **步骤4: 检查其他关键变量**
确保以下变量也正确设置：

```env
NEXTAUTH_URL = https://sybaupicture.com
NEXT_PUBLIC_APP_URL = https://sybaupicture.com
NEXT_PUBLIC_BASE_URL = https://sybaupicture.com
DATABASE_URL = postgresql://postgres.niqywjbgqkfvuqhngbxm:Funinhand1122@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **步骤5: 重新部署**
1. 更新完所有变量后
2. 点击 **Deployments** 标签
3. 点击最新部署右侧的 **...** 按钮
4. 选择 **Redeploy**
5. 等待部署完成（通常需要2-3分钟）

---

## 🎯 完成后的测试

### **测试1: 访问主页**
- 访问：https://sybaupicture.com
- 检查页面是否正常加载

### **测试2: 测试Google登录**
- 访问：https://sybaupicture.com/zh/auth/signin
- 点击 **Google登录** 按钮
- **预期结果**: 不再显示"客户端未找到"错误

### **测试3: 测试注册功能**
- 访问：https://sybaupicture.com/zh/auth/signup
- 测试邮箱注册功能
- **预期结果**: 注册成功后自动登录

---

## 🚨 故障排除

### **如果仍然出现"客户端未找到"错误**:
1. **检查部署状态**: 确保Vercel重新部署完成
2. **清除浏览器缓存**: 清除所有cookies和缓存
3. **等待传播**: 配置更改可能需要5-10分钟生效
4. **检查DNS**: 确保 sybaupicture.com 正确指向Vercel

### **如果出现其他错误**:
1. **检查环境变量**: 确保所有变量都正确设置
2. **检查重定向URI**: 确保Google Cloud Console中的URI完全匹配
3. **检查应用发布状态**: 确保Google应用已发布到生产环境

---

## 📊 当前状态
- ✅ **本地环境**: 新Google OAuth配置已更新
- ✅ **Google Cloud**: 新OAuth客户端已创建
- 🔄 **Vercel环境**: 需要立即更新
- 🔄 **功能测试**: 更新后进行测试

---

## 🎉 预期结果
更新完成后，您应该能够：
- ✅ 正常访问所有页面
- ✅ 使用Google账户登录
- ✅ 邮箱注册功能正常
- ✅ 所有功能完全正常工作

**现在请立即执行上述步骤！** 🚀
