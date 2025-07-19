// 🌍 Sybau Picture - 智能环境管理系统 v2.0
// 简化版：只支持开发模式和生产模式

export type EnvironmentType = 'development' | 'production';

export interface EnvironmentConfig {
  environment: EnvironmentType;
  baseUrl: string;
  isDevelopment: boolean;
  database: DatabaseConfig;
  auth: AuthConfig;
  ai: AIConfig;
  payment: PaymentConfig;
  email: EmailConfig;
  debug: boolean;
}

export interface DatabaseConfig {
  url: string;
  type: 'supabase' | 'local';
}

export interface AuthConfig {
  provider: 'google';
  clientId: string;
  clientSecret: string;
  secret: string;
}

export interface AIConfig {
  provider: 'fal';
  apiKey: string;
}

export interface PaymentConfig {
  provider: 'stripe';
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
}

export interface EmailConfig {
  provider: 'resend' | 'smtp';
  apiKey?: string;
  fromEmail: string;
}

/**
 * 检测当前环境类型
 */
export function detectEnvironment(): EnvironmentType {
  // 检查环境变量
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  // 检查URL
  if (process.env.NEXTAUTH_URL?.includes('localhost') ||
      process.env.NEXTAUTH_URL?.includes('127.0.0.1')) {
    return 'development';
  }

  // 默认开发环境
  return 'development';
}

/**
 * 获取环境配置 - 智能环境变量管理
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = detectEnvironment();

  // 清理环境变量函数
  const cleanEnv = (value: string | undefined): string => {
    return value ? value.trim().replace(/[\r\n\t]/g, '') : '';
  };

  // 智能获取环境变量 - 优先级：通用名称 > 环境特定名称 > 后备值
  const getEnvVar = (genericName: string, prodSuffix?: string, devSuffix?: string, fallback: string = ''): string => {
    // 1. 优先使用通用名称（适用于所有环境）
    const generic = cleanEnv(process.env[genericName]);
    if (generic) return generic;

    // 2. 根据环境使用特定名称
    if (environment === 'production' && prodSuffix) {
      const prodValue = cleanEnv(process.env[prodSuffix]);
      if (prodValue) return prodValue;
    } else if (environment === 'development' && devSuffix) {
      const devValue = cleanEnv(process.env[devSuffix]);
      if (devValue) return devValue;
    }

    // 3. 使用后备值
    return fallback;
  };

  // 获取基础URL - 更智能的逻辑
  const getBaseUrl = (): string => {
    if (environment === 'production') {
      return cleanEnv(process.env.NEXTAUTH_URL) || 
             cleanEnv(process.env.NEXT_PUBLIC_BASE_URL) || 
             'https://sybaupicture.com';
    } else {
      // 开发环境：支持端口动态检测
      const devUrl = cleanEnv(process.env.NEXTAUTH_URL) || 
                     cleanEnv(process.env.NEXT_PUBLIC_BASE_URL);
      
      if (devUrl) return devUrl;
      
      // 默认开发端口（可以通过环境变量覆盖）
      const port = process.env.PORT || '3001';
      return `http://localhost:${port}`;
    }
  };

  return {
    environment,
    baseUrl: getBaseUrl(),
    isDevelopment: environment === 'development',
    database: {
      url: cleanEnv(process.env.DATABASE_URL) || cleanEnv(process.env.POSTGRES_PRISMA_URL) || '',
      type: environment === 'production' ? 'supabase' : 'local'
    },
    auth: {
      provider: 'google',
      clientId: getEnvVar('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID_PROD', 'GOOGLE_CLIENT_ID_DEV'),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', 'GOOGLE_CLIENT_SECRET_PROD', 'GOOGLE_CLIENT_SECRET_DEV'),
      secret: getEnvVar('NEXTAUTH_SECRET', undefined, undefined, 'fallback-secret-for-dev')
    },
    ai: {
      provider: 'fal',
      apiKey: getEnvVar('FAL_KEY')
    },
    payment: {
      provider: 'stripe',
      secretKey: getEnvVar('STRIPE_SECRET_KEY', 'STRIPE_SECRET_KEY_PROD', 'STRIPE_SECRET_KEY_DEV'),
      publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV'),
      webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', 'STRIPE_WEBHOOK_SECRET_PROD', 'STRIPE_WEBHOOK_SECRET_DEV')
    },
    email: {
      provider: 'resend',
      apiKey: getEnvVar('RESEND_API_KEY'),
      fromEmail: getEnvVar('FROM_EMAIL_ADDRESS', undefined, undefined, 'noreply@sybaupicture.com')
    },
    debug: environment === 'development'
  };
}

// ==================== 兼容性导出 ====================
// 为保持向后兼容性而提供的导出

/**
 * @deprecated 使用 getEnvironmentConfig() 替代
 */
export const appConfig = getEnvironmentConfig();

/**
 * @deprecated 使用 detectEnvironment() === 'development' 替代
 */
export const isDevelopment = detectEnvironment() === 'development';

/**
 * @deprecated 模拟模式已移除，始终返回 false
 */
export const isMockMode = false;

/**
 * @deprecated 使用 getEnvironmentConfig() 替代
 */
export function getServiceConfig() {
  return getEnvironmentConfig();
}

// ==================== 核心功能 ====================

/**
 * 验证环境配置
 */
export function validateConfiguration(config: EnvironmentConfig): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // 验证基础配置
  if (!config.baseUrl) {
    issues.push('缺少基础URL配置');
  }

  // 验证数据库配置
  if (!config.database.url) {
    issues.push('缺少数据库URL配置');
    suggestions.push('请配置DATABASE_URL环境变量');
  }

  // 验证认证配置
  if (!config.auth.clientId || !config.auth.clientSecret) {
    issues.push('缺少Google OAuth配置');
    if (config.environment === 'production') {
      suggestions.push('请配置GOOGLE_CLIENT_ID和GOOGLE_CLIENT_SECRET环境变量');
    } else {
      suggestions.push('请配置GOOGLE_CLIENT_ID_DEV和GOOGLE_CLIENT_SECRET_DEV环境变量');
    }
  }

  if (!config.auth.secret) {
    issues.push('缺少NextAuth密钥');
    suggestions.push('请配置NEXTAUTH_SECRET环境变量');
  }

  // 验证AI配置
  if (!config.ai.apiKey) {
    issues.push('缺少AI服务密钥');
    suggestions.push('请配置FAL_KEY环境变量');
  }

  // 验证支付配置
  if (!config.payment.secretKey || !config.payment.publishableKey) {
    issues.push('缺少Stripe支付配置');
    if (config.environment === 'production') {
      suggestions.push('请配置STRIPE_SECRET_KEY_PROD和NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD环境变量');
    } else {
      suggestions.push('请配置STRIPE_SECRET_KEY_DEV和NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV环境变量');
    }
  }

  if (!config.payment.webhookSecret) {
    issues.push('缺少Stripe Webhook配置');
    if (config.environment === 'production') {
      suggestions.push('请配置STRIPE_WEBHOOK_SECRET_PROD环境变量');
    } else {
      suggestions.push('请配置STRIPE_WEBHOOK_SECRET_DEV环境变量');
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * 获取环境状态报告
 */
export function getEnvironmentReport(): string {
  const config = getEnvironmentConfig();
  const validation = validateConfiguration(config);

  const report = [
    '🌍 环境状态报告',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 当前环境: ${config.environment === 'development' ? '开发环境' : '生产环境'}`,
    `🔗 基础URL: ${config.baseUrl}`,
    `💾 数据库类型: ${config.database.type}`,
    `🔑 认证提供商: ${config.auth.provider}`,
    `🤖 AI提供商: ${config.ai.provider}`,
    `💳 支付提供商: ${config.payment.provider}`,
    `🐛 调试模式: ${config.debug ? '开启' : '关闭'}`,
    ''
  ];

  if (!validation.isValid) {
    report.push('⚠️  配置问题:');
    validation.issues.forEach(issue => report.push(`   • ${issue}`));
    report.push('');
    report.push('💡 建议:');
    validation.suggestions.forEach(suggestion => report.push(`   • ${suggestion}`));
  } else {
    report.push('✅ 配置验证通过');
  }

  report.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return report.join('\n');
}

/**
 * 获取环境切换建议
 */
export function getEnvironmentSwitchHelp(): string {
  return [
    '🎯 环境切换命令指南',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🔧 开发环境切换:',
    '   npm run env:dev     或者    node scripts/smart-env.js 开发',
    '',
    '🚀 生产环境切换:',
    '   npm run env:prod    或者    node scripts/smart-env.js 生产',
    '',
    '📊 查看环境状态:',
    '   npm run env:status  或者    node scripts/smart-env.js 状态',
    '',
    '⚡ 智能启动:',
    '   npm run start:smart 或者    node scripts/smart-startup.js',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  ].join('\n');
}
