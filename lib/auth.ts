import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

// Google OAuth配置检查 - 开发环境使用默认配置
const isGoogleOAuthConfigured = () => {
  // 在开发环境中总是返回true，使用测试配置
  return true
}

export const authOptions: NextAuthOptions = {
  // 使用JWT策略，更适合生产环境
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7天
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "test-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "test-client-secret",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/signin',
    verifyRequest: '/auth/signin',
    newUser: '/auth/signin' // 新用户也重定向到登录页面
  },

  // 强制使用自定义页面
  theme: {
    colorScheme: 'light'
  },

  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }

      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
      }

      return token
    },

    session: async ({ session, token }) => {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        (session.user as any).provider = token.provider || 'google'
      }
      return session
    },

    signIn: async ({ user, account, profile }) => {
      console.log('Google登录回调:', {
        userId: user.id,
        email: user.email,
        provider: account?.provider
      })

      if (account?.provider === 'google' && profile) {
        try {
          if (!prisma) {
            console.error('数据库未配置')
            return true // 允许登录但不保存到数据库
          }

          // 查找或创建用户
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // 创建新用户
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image,
                password: null, // Google用户没有密码
              }
            })

            // 创建账户关联
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              }
            })

            console.log('Google用户创建成功:', user.email)
          } else {
            // 检查账户关联是否存在
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId
                }
              }
            })

            if (!existingAccount) {
              // 创建账户关联
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                }
              })
            }
          }
        } catch (error) {
          console.error('Google登录处理错误:', error)
          return true // 允许登录但记录错误
        }
      }

      return true
    },

    redirect: async ({ url, baseUrl }) => {
      console.log('重定向回调:', { url, baseUrl })

      // 强制将baseUrl设为本地地址（在开发环境中）
      const localBaseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : baseUrl

      // 强制阻止跳转到NextAuth内置页面
      if (url.includes('/api/auth/signin') ||
          url.includes('/api/auth/signout') ||
          url.includes('oauth') ||
          url.includes('providers') ||
          url.includes('csrf') ||
          url.includes('error')) {
        console.log('强制重定向到自定义登录页面')
        return `${localBaseUrl}/auth/signin`
      }

      // 处理登录成功后的重定向
      if (url.startsWith('/')) {
        const fullUrl = `${localBaseUrl}${url}`
        console.log('处理相对路径重定向:', fullUrl)
        return fullUrl
      }

      if (url.startsWith(localBaseUrl)) {
        console.log('处理绝对路径重定向:', url)
        return url
      }

      console.log('默认重定向到首页')
      return localBaseUrl
    },
  },

  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      const provider = account?.provider || 'google'
      console.log(`✅ 用户登录成功: ${user.email} (${provider})${isNewUser ? ' - 新用户' : ''}`)
    },
    signOut: async ({ session, token }) => {
      console.log(`👋 用户登出`)
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}
