import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { getEnvironmentConfig, isMockMode } from '@/lib/env-manager'
import { mockGoogleAuth } from '@/lib/mock-services'

// 获取当前环境配置
const envConfig = getEnvironmentConfig()

export const authOptions: NextAuthOptions = {
  // 使用JWT策略，更适合生产环境
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7天
  },

  providers: isMockMode ? [
    // 模拟模式：使用模拟认证
    CredentialsProvider({
      id: 'mock-google',
      name: 'Mock Google',
      credentials: {
        email: { label: "邮箱", type: "email", placeholder: "test@example.com" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        console.log('🎭 模拟Google登录:', credentials.email)

        // 使用模拟认证
        const mockAuth = mockGoogleAuth(credentials.email)

        return {
          id: mockAuth.user.id,
          email: mockAuth.user.email,
          name: mockAuth.user.name,
          image: mockAuth.user.image,
        }
      }
    })
  ] : [
    // 生产模式：使用真实的Google OAuth
    GoogleProvider({
      clientId: envConfig.auth.clientId,
      clientSecret: envConfig.auth.clientSecret,
      authorization: {
        params: {
          prompt: "select_account",
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
        (session.user as any).provider = token.provider || (isMockMode ? 'mock-google' : 'google')
      }
      return session
    },

    signIn: async ({ user, account, profile }) => {
      console.log('登录回调:', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        mockMode: isMockMode
      })

      // 模拟模式：跳过数据库操作
      if (isMockMode) {
        console.log('🎭 模拟模式登录成功:', user.email)
        return true
      }

      // 生产模式：正常的Google OAuth处理
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
      console.log('重定向回调:', { url, baseUrl, mockMode: isMockMode })

      // 使用环境管理器的baseUrl
      const localBaseUrl = envConfig.baseUrl

      // 强制阻止跳转到NextAuth内置页面
      if (url.includes('/api/auth/signin') ||
          url.includes('/api/auth/signout') ||
          url.includes('oauth') ||
          url.includes('providers') ||
          url.includes('csrf')) {
        console.log('阻止跳转到内置页面，重定向到首页')
        return localBaseUrl
      }

      // 如果是相对路径，返回本地baseUrl + 路径
      if (url.startsWith('/')) {
        const redirectUrl = localBaseUrl + url
        console.log('重定向到:', redirectUrl)
        return redirectUrl
      }

      // 确保只能重定向到同域名下
      if (url.startsWith(localBaseUrl)) {
        console.log('同域名重定向:', url)
        return url
      }

      // 默认重定向到首页
      console.log('默认重定向到首页')
      return localBaseUrl
    }
  },

  events: {
    signIn: async ({ user, account, profile }) => {
      const provider = account?.provider || (isMockMode ? 'mock-google' : 'google')
      const mode = isMockMode ? ' (模拟模式)' : ''
      console.log(`👋 用户登录成功${mode}:`, user.email, `via ${provider}`)
    },

    signOut: async ({ token }) => {
      console.log(`👋 用户登出${isMockMode ? ' (模拟模式)' : ''}`)
    }
  },

  secret: envConfig.auth.secret,

  // 调试信息
  debug: envConfig.debug,
}
