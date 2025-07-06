
# Google OAuth 重定向URI配置

## 当前应用运行地址
- 开发服务器: http://localhost:3001
- 生产服务器: https://your-domain.com

## 需要在Google Console中配置的重定向URI
- http://localhost:3001/api/auth/callback/google
- https://localhost:3001/api/auth/callback/google

## 配置步骤
1. 访问 Google Cloud Console
2. 选择您的项目
3. 进入 APIs & Services > Credentials
4. 编辑OAuth 2.0客户端ID
5. 在"Authorized redirect URIs"中添加上述URI
6. 保存更改

## 客户端ID信息
- 客户端ID: 42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com
- 请确保重定向URI与此客户端ID匹配
