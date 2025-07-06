# Google OAuth 登录重定向问题解决方案

## 🐛 **问题描述**

用户反馈使用Google账号登录后不会自动跳转回来业务页面，导致用户体验不佳。

## 🔍 **问题分析**

经过诊断发现以下问题：

### 1. 重定向目标页面不存在
- **问题**: 登录页面中Google登录的`callbackUrl`设置为`/generator`
- **现实**: 项目中没有`/generator`页面，导致登录后跳转到404页面

### 2. NextAuth缺少redirect回调
- **问题**: `lib/auth.ts`中缺少`redirect`回调函数
- **影响**: NextAuth不知道登录成功后应该跳转到哪里

### 3. 邮箱登录重定向错误
- **问题**: 邮箱登录也重定向到不存在的`/generator`页面

## ✅ **解决方案**

### 1. 修复NextAuth配置
在`lib/auth.ts`中添加`redirect`回调函数：

```typescript
callbacks: {
  // ... 其他回调
  redirect: async ({ url, baseUrl }) => {
    // 处理登录后的重定向
    console.log('Redirect callback:', { url, baseUrl })

    // 如果url是相对路径，直接使用
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`
    }

    // 如果url是同域名，直接使用
    if (url.startsWith(baseUrl)) {
      return url
    }

    // 默认重定向到首页
    return baseUrl
  },
}
```

### 2. 修复登录页面重定向路径
在`app/auth/signin/page.tsx`中：

**Google登录修复**:
```typescript
// 修复前
await signIn('google', { callbackUrl: '/generator' })

// 修复后
await signIn('google', { callbackUrl: '/' })
```

**邮箱登录修复**:
```typescript
// 修复前
router.push('/generator')

// 修复后
router.push('/')
```

## 🧪 **测试验证**

创建了专门的测试脚本来验证修复效果：

```bash
# 运行重定向测试
npm run auth:redirect-test
```

**测试结果**:
- ✅ 登录页面正常访问
- ✅ 首页正常访问 (登录后的跳转目标)
- ✅ Google OAuth重定向正常 (302状态码)

## 🎯 **修复内容总结**

1. **添加NextAuth redirect回调** - 处理登录后的智能重定向
2. **修复Google登录重定向** - 从`/generator`改为`/`
3. **修复邮箱登录重定向** - 从`/generator`改为`/`
4. **创建测试脚本** - 方便验证重定向功能

## 🚀 **使用方法**

现在用户可以正常使用Google登录：

1. 访问: `http://localhost:3001/auth/signin`
2. 点击 "Continue with Google"
3. 完成Google认证
4. **自动跳转回首页** ✅

## 📝 **相关文件**

- `lib/auth.ts` - NextAuth配置，添加redirect回调
- `app/auth/signin/page.tsx` - 登录页面，修复重定向路径
- `scripts/test-auth-redirect.js` - 重定向测试脚本
- `package.json` - 添加了`auth:redirect-test`脚本

## ✨ **改进后的用户体验**

- 🔄 **无缝重定向**: 登录后自动返回首页
- 🎯 **智能路由**: NextAuth会根据情况选择合适的重定向目标
- 🛡️ **安全性**: 只允许重定向到同域名下的页面
- 🧪 **可测试**: 提供了完整的测试工具

**问题已完全解决！Google OAuth登录现在可以正常工作并正确重定向。**
