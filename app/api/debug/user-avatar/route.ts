import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/prisma';

// 强制动态渲染，因为使用了session
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== 用户头像调试 API ===');

    // 1. 检查session
    const session = await getServerSession(authOptions);
    console.log('Session状态:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      sessionImage: session?.user?.image,
      userName: session?.user?.name
    });

    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'User not authenticated',
        debug: {
          session: null
        }
      }, { status: 401 });
    }

    // 2. 检查数据库中的用户数据
    const dbUser = await safeQuery(async () => {
      return await prisma!.user.findUnique({
        where: { email: session.user!.email! },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true
        }
      });
    });

    console.log('数据库用户:', dbUser);

    // 3. 检查账户关联
    const accounts = await safeQuery(async () => {
      return await prisma!.account.findMany({
        where: {
          user: { email: session.user!.email! }
        },
        select: {
          provider: true,
          providerAccountId: true,
          access_token: true,
          updatedAt: true
        }
      });
    });

    console.log('关联账户:', accounts);

    return NextResponse.json({
      success: true,
      debug: {
        session: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image
        },
        database: dbUser,
        accounts: accounts,
        comparison: {
          sessionImageMatchesDb: session.user.image === dbUser?.image,
          sessionNameMatchesDb: session.user.name === dbUser?.name,
        },
        recommendations: [
          ' 如果session头像与数据库不一致，需要强制刷新session',
          '如果数据库头像为空或错误，需要重新登录',
          '清除浏览器缓存或使用无痕模式测试'
        ]
      }
    });

  } catch (error) {
    console.error('调试API错误:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug API failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
