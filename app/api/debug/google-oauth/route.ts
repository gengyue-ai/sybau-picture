import { NextRequest, NextResponse } from 'next/server'
import { getEnvironmentConfig } from '@/lib/env-manager'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Google OAuth配置检查 ===')

    const envConfig = getEnvironmentConfig()

    // 检查OAuth配置
    const oauthCheck = {
      environment: envConfig.environment,
      baseUrl: envConfig.baseUrl,
      clientIdExists: !!envConfig.auth.clientId,
      clientIdLength: envConfig.auth.clientId?.length,
      clientIdPrefix: envConfig.auth.clientId?.substring(0, 20),
      clientSecretExists: !!envConfig.auth.clientSecret,
      clientSecretLength: envConfig.auth.clientSecret?.length,
      authSecret: !!envConfig.auth.secret,

      // 预期的重定向URI
      expectedRedirectUri: `${envConfig.baseUrl}/api/auth/callback/google`,

      // Google OAuth URLs
      googleAuthUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${envConfig.auth.clientId}&redirect_uri=${encodeURIComponent(envConfig.baseUrl + '/api/auth/callback/google')}&response_type=code&scope=openid%20email%20profile&state=test`,

      // 配置验证
      urlClean: envConfig.baseUrl === (process.env.NEXTAUTH_URL || '').trim().replace(/[\r\n]/g, ''),
    }

    return NextResponse.json({
      success: true,
      oauth: oauthCheck,
      recommendations: [
        !oauthCheck.clientIdExists ? '❌ Google Client ID缺失' : '✅ Google Client ID存在',
        !oauthCheck.clientSecretExists ? '❌ Google Client Secret缺失' : '✅ Google Client Secret存在',
        !oauthCheck.authSecret ? '❌ NextAuth Secret缺失' : '✅ NextAuth Secret存在',
        !oauthCheck.urlClean ? '⚠️ URL可能有格式问题' : '✅ URL格式正确',
        `🔗 重定向URI应该是: ${oauthCheck.expectedRedirectUri}`,
        '💡 确保在Google Cloud Console中配置了正确的重定向URI'
      ]
    })

  } catch (error) {
    console.error('Google OAuth配置检查失败:', error)
    return NextResponse.json({
      success: false,
      error: 'OAuth config check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
