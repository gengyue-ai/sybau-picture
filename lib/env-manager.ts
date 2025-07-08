// 🌍 Sybau Picture - 智能环境管理系统 v2.0
// 简化版：只支持开发模式和生产模式

export type EnvironmentType = 'development' | 'production';

export interface EnvironmentConfig {
  environment: EnvironmentType;
  baseUrl: string;
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
 * 获取环境配置
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = detectEnvironment();

  return {
    environment,
    baseUrl: environment === 'production'
      ? process.env.NEXTAUTH_URL || 'https://sybaupicture.com'
      : 'http://localhost:3001',
    database: {
      url: process.env.DATABASE_URL || '',
      type: environment === 'production' ? 'supabase' : 'local'
    },
    auth: {
      provider: 'google',
      clientId: environment === 'production'
        ? process.env.GOOGLE_CLIENT_ID_PROD || ''
        : process.env.GOOGLE_CLIENT_ID_DEV || '',
      clientSecret: environment === 'production'
        ? process.env.GOOGLE_CLIENT_SECRET_PROD || ''
        : process.env.GOOGLE_CLIENT_SECRET_DEV || '',
      secret: process.env.NEXTAUTH_SECRET || ''
    },
    ai: {
      provider: 'fal',
      apiKey: process.env.FAL_KEY || ''
    },
    payment: {
      provider: 'stripe',
      secretKey: environment === 'production'
        ? process.env.STRIPE_SECRET_KEY_PROD || ''
        : process.env.STRIPE_SECRET_KEY_DEV || '',
      publishableKey: environment === 'production'
        ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD || ''
        : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV || '',
      webhookSecret: environment === 'production'
        ? process.env.STRIPE_WEBHOOK_SECRET_PROD || ''
        : process.env.STRIPE_WEBHOOK_SECRET_DEV || ''
    },
    email: {
      provider: 'resend',
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.FROM_EMAIL_ADDRESS || 'noreply@sybaupicture.com'
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
      suggestions.push('请配置GOOGLE_CLIENT_ID_PROD和GOOGLE_CLIENT_SECRET_PROD');
    } else {
      suggestions.push('请配置GOOGLE_CLIENT_ID_DEV和GOOGLE_CLIENT_SECRET_DEV');
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
      suggestions.push('请配置STRIPE_SECRET_KEY_PROD和相关生产环境密钥');
    } else {
      suggestions.push('请配置STRIPE_SECRET_KEY_DEV和相关开发环境密钥');
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
