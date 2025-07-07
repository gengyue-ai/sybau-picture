import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  providers: [
    // 暂时禁用Google Provider直到OAuth配置修复
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
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
      })
    ] : []),
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
    strategy: 'jwt', // 暂时使用JWT策略
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
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
      }
      return session
    },
    signIn: async ({ user, account, profile }) => {
      return true
    },
    redirect: async ({ url, baseUrl }) => {
      console.log('Redirect callback:', { url, baseUrl })

      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`
        console.log('Redirecting to relative path:', fullUrl)
        return fullUrl
      }

      if (url.startsWith(baseUrl)) {
        console.log('Redirecting to same domain:', url)
        return url
      }

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
