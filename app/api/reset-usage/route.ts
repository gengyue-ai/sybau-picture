import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma, safeQuery } from '@/lib/prisma';

async function resetUserUsage(request: NextRequest) {
  try {
    console.log('=== 重置用户使用记录 ===');

    // 检查用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured',
      }, { status: 500 });
    }

    const userEmail = session.user.email;
    console.log('重置用户使用记录:', userEmail);

    // 1. 查找用户
    const user = await safeQuery(async () => {
      return await prisma!.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          email: true,
          name: true,
          planId: true
        }
      });
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found in database',
      }, { status: 404 });
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // 2. 重置当月使用记录
    const resetResult = await safeQuery(async () => {
      return await prisma!.userUsage.upsert({
        where: {
          userId_month_year: {
            userId: user.id,
            month: currentMonth,
            year: currentYear
          }
        },
        update: {
          imagesGenerated: 0,
          updatedAt: new Date()
        },
        create: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          imagesGenerated: 0
        }
      });
    });

    console.log('使用记录重置成功:', resetResult);

    return NextResponse.json({
      success: true,
      message: '免费生成次数已重置',
      data: {
        userEmail: user.email,
        planId: user.planId,
        month: currentMonth,
        year: currentYear,
        imagesGenerated: 0
      }
    });

  } catch (error) {
    console.error('重置使用记录失败:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset usage',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// 支持POST和GET方法
export async function POST(request: NextRequest) {
  return resetUserUsage(request);
}

export async function GET(request: NextRequest) {
  return resetUserUsage(request);
}
