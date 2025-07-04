# 网络配置指南 - 解决Fal AI连接问题

## 问题诊断

根据您的错误日志，问题为：
- `fetch failed` - 网络连接失败
- `timeout` - 连接超时
- 无法连接到 `fal.run` 服务器

## 解决方案

### 1. 检查网络连接

首先确认基本网络连接：

```bash
# 测试基本网络连接
ping google.com
ping fal.run

# 测试DNS解析
nslookup fal.run
```

### 2. 代理配置

如果您在公司网络或需要代理：

#### 方法1：环境变量配置
```bash
# 设置代理环境变量
export HTTP_PROXY=http://proxy-server:port
export HTTPS_PROXY=http://proxy-server:port
export NO_PROXY=localhost,127.0.0.1,.local

# 或者在 Windows PowerShell
$env:HTTP_PROXY = "http://proxy-server:port"
$env:HTTPS_PROXY = "http://proxy-server:port"
```

#### 方法2：修改Next.js配置
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://fal.run/:path*',
      },
    ]
  },
}
```

### 3. 防火墙配置

确保防火墙允许访问 Fal AI 服务器：

#### Windows防火墙
1. 打开 Windows 防火墙
2. 点击"允许应用或功能通过Windows防火墙"
3. 添加 Node.js 和您的开发环境

#### 企业防火墙
联系网络管理员，请求将以下域名加入白名单：
- `fal.run`
- `*.fal.run`
- `fal.ai`
- `*.fal.ai`

### 4. VPN 解决方案

如果地理位置限制，尝试使用VPN：

```bash
# 推荐VPN服务器位置
- 美国东部/西部
- 欧洲（德国、荷兰）
- 新加坡
```

### 5. 替代网络环境

尝试不同的网络环境：
- 手机热点
- 家庭宽带
- 公共WiFi
- 云服务器

### 6. 代码级别的网络配置

修改Fal AI客户端配置：

```javascript
// 在您的API文件中添加网络配置
const fal = new FalClient({
  credentials: process.env.FAL_KEY,
  timeout: 60000, // 增加超时时间
  retry: {
    attempts: 3,
    delay: 1000,
  },
  // 添加代理配置（如果需要）
  proxy: process.env.HTTP_PROXY,
})
```

## 测试步骤

1. **基础连接测试**
   ```bash
   curl -I https://fal.run
   ```

2. **API密钥测试**
   ```bash
   curl -H "Authorization: Key YOUR_FAL_KEY" https://fal.run/api/v1/models
   ```

3. **Node.js网络测试**
   ```javascript
   // 创建简单的网络测试脚本
   const https = require('https');
   
   https.get('https://fal.run', (res) => {
     console.log('Status:', res.statusCode);
     console.log('Headers:', res.headers);
   }).on('error', (err) => {
     console.error('Error:', err.message);
   });
   ```

## 常见错误及解决方案

### 错误1: `ECONNREFUSED`
- **原因**：服务器拒绝连接
- **解决**：检查防火墙设置

### 错误2: `ETIMEDOUT`
- **原因**：连接超时
- **解决**：增加超时时间或使用VPN

### 错误3: `ENOTFOUND`
- **原因**：DNS解析失败
- **解决**：更换DNS服务器（如8.8.8.8）

### 错误4: `CERT_AUTHORITY_INVALID`
- **原因**：SSL证书问题
- **解决**：检查系统时间或使用可信CA证书

## 紧急解决方案

如果以上方法都不行，可以考虑：

1. **使用云服务器**：在云服务器上部署应用
2. **使用反向代理**：通过自己的服务器代理请求
3. **联系ISP**：询问是否有特殊限制

## 联系支持

如果问题仍然存在：
- 📧 Fal AI支持：support@fal.ai
- 📞 网络管理员：联系您的网络管理员
- 🔧 技术支持：提供详细的错误日志 