# 🌐 Sybau Picture 自定义域名配置指南

## 📊 **当前状态**
- ✅ 应用已部署到 Vercel
- ✅ NEXTAUTH_URL 已更新为 `https://sybaupicture.com`
- ⏳ 等待 DNS 配置生效
- ⏳ 需要更新 Google OAuth 配置

---

## 🎯 **配置步骤**

### 1️⃣ **在 Vercel 中添加域名**

#### **步骤A：添加域名到 Vercel 项目**

1. **访问 Vercel Dashboard**：
   - 打开 [vercel.com/dashboard](https://vercel.com/dashboard)
   - 找到你的 `sybaupicture` 项目

2. **进入项目设置**：
   - 点击项目名称进入项目详情
   - 点击 "Settings" 标签
   - 在左侧菜单中选择 "Domains"

3. **添加域名**：
   - 点击 "Add Domain" 按钮
   - 输入：`sybaupicture.com`
   - 点击 "Add" 确认

4. **Vercel 会显示所需的 DNS 记录**：
   ```
   Type: A
   Name: @ (或留空)
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

### 2️⃣ **在 DreamHost 中配置 DNS**

#### **步骤B：配置 DreamHost DNS 设置**

1. **登录 DreamHost 控制面板**：
   - 访问 [panel.dreamhost.com](https://panel.dreamhost.com)
   - 使用你的 DreamHost 账户登录

2. **进入 DNS 管理**：
   - 在左侧菜单中找到 "Domains"
   - 点击 "Manage Domains" 或 "DNS"

3. **找到你的域名**：
   - 找到 `sybaupicture.com`
   - 点击域名旁边的 "DNS" 或 "Edit" 按钮

4. **添加/修改 DNS 记录**：

   **主域名记录 (A记录)**：
   ```
   Type: A
   Host: @ (或 sybaupicture.com 或留空)
   Points to: 76.76.19.61
   TTL: 14400 (或使用默认值)
   ```

   **www 子域名记录 (CNAME)**：
   ```
   Type: CNAME
   Host: www
   Points to: cname.vercel-dns.com
   TTL: 14400 (或使用默认值)
   ```

5. **保存设置**：
   - 点击 "Save Changes" 或 "Update" 按钮
   - 确认所有更改已保存

---

### 3️⃣ **验证 DNS 配置**

#### **步骤C：检查 DNS 传播状态**

1. **等待 DNS 传播**：
   - DNS 更改通常需要 **5-30 分钟**生效
   - 在某些情况下最多可能需要 **24 小时**

2. **在线检查 DNS**：
   - 访问 [dnschecker.org](https://dnschecker.org/)
   - 输入 `sybaupicture.com` 检查 A 记录
   - 输入 `www.sybaupicture.com` 检查 CNAME 记录

3. **命令行检查**（可选）：
   ```bash
   # 检查 A 记录
   nslookup sybaupicture.com

   # 检查 CNAME 记录
   nslookup www.sybaupicture.com
   ```

4. **在 Vercel 中验证**：
   - 返回 Vercel 项目的 Domains 页面
   - 等待域名状态变为 **"Valid Configuration"**
   - 状态变为绿色 ✅ 表示配置成功

---

### 4️⃣ **更新 Google OAuth 配置**

#### **步骤D：添加新的重定向 URI**

1. **访问 Google Cloud Console**：
   - 打开 [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

2. **编辑 OAuth 2.0 客户端**：
   - 找到你的 OAuth 2.0 客户端 ID
   - 点击编辑图标（铅笔图标）

3. **添加授权重定向 URI**：
   在 "授权重定向 URI" 部分，添加以下两个 URI：
   ```
   https://sybaupicture.com/api/auth/callback/google
   https://www.sybaupicture.com/api/auth/callback/google
   ```

4. **保存更改**：
   - 点击 "保存" 按钮
   - 等待几分钟让更改生效

---

### 5️⃣ **测试和验证**

#### **步骤E：全面功能测试**

DNS 生效后，请测试以下功能：

1. **访问网站**：
   - 主域名：[https://sybaupicture.com](https://sybaupicture.com)
   - www 域名：[https://www.sybaupicture.com](https://www.sybaupicture.com)

2. **测试用户认证**：
   - 点击 "登录" 按钮
   - 选择 "使用 Google 登录"
   - 验证登录流程是否正常

3. **测试核心功能**：
   - ✅ AI 图片生成
   - ✅ 图片历史记录
   - ✅ 多语言切换
   - ✅ 支付功能

---

## 🔧 **常见问题解决**

### **问题 1：DNS 未生效**
- **症状**：访问域名显示错误或无法访问
- **解决**：等待更长时间（最多 24 小时），使用在线 DNS 检查工具验证

### **问题 2：SSL 证书问题**
- **症状**：浏览器显示 "不安全" 或 SSL 错误
- **解决**：等待 Vercel 自动颁发 SSL 证书（通常 5-10 分钟）

### **问题 3：Google OAuth 登录失败**
- **症状**：点击 Google 登录后出现错误
- **解决**：确认已在 Google Cloud Console 中添加新的重定向 URI

### **问题 4：Vercel 域名状态显示错误**
- **症状**：Vercel 中域名状态为红色或显示配置错误
- **解决**：检查 DNS 记录是否正确，等待 DNS 传播完成

---

## 📞 **需要帮助**

如果遇到任何问题，请：

1. **检查 DNS 配置**：确认 A 记录和 CNAME 记录设置正确
2. **等待足够时间**：DNS 传播可能需要几小时
3. **清除浏览器缓存**：使用无痕模式访问网站
4. **联系支持**：如果问题持续，可以联系 DreamHost 或 Vercel 支持

---

## 🎉 **配置完成后**

域名配置成功后，你的 Sybau Picture 应用将：

- ✅ 使用专业的自定义域名
- ✅ 拥有自动的 HTTPS 加密
- ✅ 支持 www 和主域名访问
- ✅ 所有功能正常运行

**恭喜！你的 AI 图片生成应用现在拥有了专业的域名！** 🚀
