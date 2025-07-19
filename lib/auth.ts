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
    jwt: async ({ token, user, account, profile }) => {
      console.log('🔑 JWT回调:', {
        hasUser: !!user,
        hasAccount: !!account,
        hasProfile: !!profile,
        provider: account?.provider
      })

      // 首次登录时设置基本信息
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }

      // Google OAuth专门处理 - 只在首次登录时设置
      if (account?.provider === 'google' && profile && user) {
        const googleImage = (profile as any)?.picture || (profile as any)?.image
        const googleName = (profile as any)?.name
        const googleEmail = (profile as any)?.email

        console.log('🎯 Google OAuth首次登录，设置最新信息')
        
        token.image = googleImage || token.image
        token.name = googleName || token.name
        token.email = googleEmail || token.email
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
          // 检查数据库配置
          const dbConfigured = process.env.DATABASE_URL &&
                               process.env.DATABASE_URL !== '[YOUR_DATABASE_URL]' &&
                               (process.env.DATABASE_URL.startsWith('postgres://') ||
                                process.env.DATABASE_URL.startsWith('postgresql://'))

          if (!dbConfigured || !prisma) {
            console.warn('⚠️ 数据库未配置，跳过用户数据保存，但允许登录')
            // 即使数据库未配置，也允许登录以保持session
            return true
          }

          // 查找或创建用户
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // 查找免费计划
            const freePlan = await prisma.plan.findFirst({
              where: {
                OR: [
                  { id: 'plan_free' },
                  { name: 'free' },
                  { name: 'Free Plan' }
                ]
              }
            });

            if (!freePlan) {
              console.error('❌ 未找到免费计划，用户创建可能失败');
            }

            // 获取最新的Google头像
            const googleImage = (profile as any)?.picture || (profile as any)?.image || user.image;

            // 创建新用户，设置为免费套餐
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: googleImage, // 使用Google profile中的最新头像
                password: null, // Google用户没有密码
                planId: freePlan?.id || null, // 如果没找到计划就设为null
              }
            });

            // 单独创建UserUsage记录
            const currentDate = new Date();
            await prisma.userUsage.create({
              data: {
                userId: newUser.id,
                month: currentDate.getMonth() + 1, // 1-12
                year: currentDate.getFullYear(),
                imagesGenerated: 0,
                lastResetAt: currentDate
              }
            });

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

            console.log('✅ Google用户创建成功(免费套餐):', user.email)
          } else {
            // 获取最新的Google头像
            const googleImage = (profile as any)?.picture || (profile as any)?.image || user.image;

            // 只在头像确实发生变化时才更新
            if (googleImage && googleImage !== existingUser.image) {
              await prisma.user.update({
                where: { email: user.email! },
                data: {
                  name: user.name || existingUser.name,
                  image: googleImage,
                }
              });
              console.log('🔄 更新用户头像:', googleImage);
            }

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
            } else {
              // 更新现有账户关联的token信息
              await prisma.account.update({
                where: { id: existingAccount.id },
                data: {
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                }
              });
            }
            console.log('✅ Google用户登录成功(头像已更新):', user.email)
          }
        } catch (error) {
          console.error('❌ Google登录数据库操作错误:', error)
          // 即使数据库操作失败，也允许登录以保持基本功能
          console.log('⚠️ 允许登录但跳过数据库操作')
          return true
        }
      }

      return true
    },

    redirect: async ({ url, baseUrl }) => {
      console.log('🔄 重定向回调:', { url, baseUrl, envBaseUrl: envConfig.baseUrl })

      // 简化重定向逻辑，避免复杂的URL检查

      // 登录成功后，始终重定向到首页
      if (url.includes('/api/auth/callback') || url.includes('/auth/signin')) {
        console.log('✅ 认证成功，重定向到首页:', envConfig.baseUrl)
        return envConfig.baseUrl
      }

      // 如果URL是相对路径，拼接baseUrl
      if (url.startsWith('/')) {
        const fullUrl = envConfig.baseUrl + url
        console.log('🔗 相对路径重定向:', fullUrl)
        return fullUrl
      }

      // 如果URL已经是完整的同域名URL，直接使用
      if (url.startsWith(envConfig.baseUrl)) {
        console.log('🎯 同域名重定向:', url)
        return url
      }

      // 默认重定向到首页
      console.log('🏠 默认重定向到首页:', envConfig.baseUrl)
      return envConfig.baseUrl
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

  // Cookie配置 - 修复域名设置
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: !envConfig.isDevelopment,
        // 不设置domain，让浏览器自动处理
        domain: undefined
      }
    }
  },

  // 调试信息
  debug: envConfig.debug,
}
