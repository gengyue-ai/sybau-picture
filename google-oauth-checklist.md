# 🔍 Google OAuth 完整检查清单

## 📋 **检查应用状态**

### **方法1：查看 OAuth 同意屏幕**

1. **访问** [console.cloud.google.com](https://console.cloud.google.com)
2. **选择正确的项目**
3. **点击左侧菜单**：
   - APIs & Services → OAuth consent screen
4. **查看页面顶部状态**：
   - ✅ **"In production"** = 已发布
   - ❌ **"Testing"** = 需要发布

### **方法2：检查用户类型**

在 OAuth 同意屏幕页面中：

- **External（外部）**：需要发布才能让所有用户使用
- **Internal（内部）**：只能组织内部用户使用，不需要发布

---

## 🔧 **修复步骤**

### **情况1：应用状态为 "Testing"**

1. **点击 "PUBLISH APP" 按钮**
2. **确认发布**
3. **等待状态变为 "In production"**

### **情况2：看不到 "PUBLISH APP" 按钮**

**可能原因**：
- 应用已经发布
- 应用类型是 "Internal"
- 权限不足

**解决方案**：
1. **检查应用类型** - 如果是 "Internal"，改为 "External"
2. **检查权限** - 确保你是项目所有者
3. **临时解决方案** - 添加测试用户

### **情况3：应用类型是 "Internal"**

1. **点击 "EDIT APP"**
2. **在 "User Type" 中选择 "External"**
3. **保存更改**
4. **现在应该能看到发布选项**

---

## 🎯 **临时解决方案**

如果无法发布应用，可以**添加测试用户**：

1. **在 OAuth 同意屏幕页面**
2. **找到 "Test users" 部分**
3. **点击 "ADD USERS"**
4. **添加**：`pamyongjiang095@gmail.com`
5. **保存**

---

## ⚡ **重定向URI配置**

同时确保在 **凭据页面** 中配置了正确的重定向URI：

1. **访问**：APIs & Services → Credentials
2. **编辑 OAuth 2.0 客户端**
3. **在授权重定向URI中添加**：
   ```
   http://localhost:3000/api/auth/callback/google
   https://sybaupicture.com/api/auth/callback/google
   https://www.sybaupicture.com/api/auth/callback/google
   ```

---

## 🧪 **测试步骤**

完成配置后：

1. **等待5-10分钟**
2. **清除浏览器缓存**
3. **访问** https://sybaupicture.com
4. **点击登录** → **Google登录**
5. **应该能正常工作**

---

## 📞 **仍然有问题？**

请检查：
- [ ] 项目选择正确
- [ ] 应用类型是 "External"
- [ ] 你有项目所有者权限
- [ ] 重定向URI配置正确
- [ ] 已等待配置生效

**如果仍然找不到发布选项，请截图发送当前的 OAuth 同意屏幕页面！**
