import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// 强制动态渲染，因为使用了session和认证
export const dynamic = 'force-dynamic'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
