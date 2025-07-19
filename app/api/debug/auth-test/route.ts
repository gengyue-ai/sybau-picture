import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEnvironmentConfig } from '@/lib/env-manager';

// 强制动态渲染，因为使用了session
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== 认证系统测试 ===');

    // 测试基本session获取
    const session = await getServerSession(authOptions);

    console.log('Session检查结果:', {
      hasSession: !!session,
      sessionData: session
    });

    // 检查环境变量和配置
    const envConfig = getEnvironmentConfig();
    const envCheck = {
      hasGoogleClientId: !!envConfig.auth.clientId,
      hasGoogleSecret: !!envConfig.auth.clientSecret,
      hasNextAuthSecret: !!envConfig.auth.secret,
      hasNextAuthUrl: !!envConfig.baseUrl,
      hasDatabaseUrl: !!envConfig.database.url,
      googleClientIdLength: envConfig.auth.clientId?.length,
      nextauthUrl: envConfig.baseUrl, // 使用清理后的URL
      databaseUrlPrefix: envConfig.database.url?.substring(0, 20),
      rawNextauthUrl: process.env.NEXTAUTH_URL, // 显示原始URL用于对比
    };

    console.log('环境变量检查:', envCheck);

    return NextResponse.json({
      success: true,
      sessionExists: !!session,
      sessionData: session ? {
        email: session.user?.email,
        name: session.user?.name,
        image: session.user?.image
      } : null,
      environment: envCheck,
      recommendations: [
        session ? '✅ 认证正常' : '❌ 未登录或session无效',
        !envCheck.hasGoogleClientId ? '❌ 缺少GOOGLE_CLIENT_ID' : '✅ Google客户端ID存在',
        !envCheck.hasNextAuthSecret ? '❌ 缺少NEXTAUTH_SECRET' : '✅ NextAuth密钥存在',
        !envCheck.hasDatabaseUrl ? '❌ 缺少DATABASE_URL' : '✅ 数据库URL存在',
        envCheck.rawNextauthUrl !== envCheck.nextauthUrl ? '🔧 URL已清理换行符' : '✅ URL格式正常'
      ]
    });

  } catch (error) {
    console.error('认证测试错误:', error);
    return NextResponse.json({
      success: false,
      error: 'Auth test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
