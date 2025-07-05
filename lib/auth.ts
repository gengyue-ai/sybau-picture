import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password')
        }

        try {
          if (!prisma) {
            throw new Error('Database not configured')
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() }
          })

          if (!user || !user.password) {
            throw new Error('Invalid credentials')
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // 错误页面重定向到登录页
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    },
    signIn: async ({ user, account, profile }) => {
      // 允许所有有效的登录
      return true
    },
    redirect: async ({ url, baseUrl }) => {
      console.log('Redirect callback:', { url, baseUrl })

      // 如果是相对路径，构建完整URL
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`
        console.log('Redirecting to relative path:', fullUrl)
        return fullUrl
      }

      // 如果是同域名的完整URL，直接使用
      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to same domain:', url)
        return url
      }

      // 对于外部URL或其他情况，重定向到首页
      console.log('Redirecting to base URL (fallback):', baseUrl)
      return baseUrl
    },
  },
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      console.log(`用户登录: ${user.email}, 新用户: ${isNewUser}`)
    },
    createUser: async ({ user }) => {
      console.log(`新用户创建: ${user.email}`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}
