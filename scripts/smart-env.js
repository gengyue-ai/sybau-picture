#!/usr/bin/env node

/**
 * 🎯 Sybau Picture - 智能环境切换脚本 v2.0
 *
 * 支持中文命令：
 * - 开发 / dev / development
 * - 生产 / prod / production
 * - 状态 / status / 检查
 * - 帮助 / help / 指南
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 彩色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.magenta}🎯 ${msg}${colors.reset}`),
  separator: () => console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
};

// 命令映射
const COMMANDS = {
  // 开发环境
  development: ['开发', 'dev', 'development', 'develop'],
  // 生产环境
  production: ['生产', 'prod', 'production', 'build'],
  // 状态查看
  status: ['状态', 'status', '检查', 'check', 'info'],
  // 帮助
  help: ['帮助', 'help', '指南', 'guide', '-h', '--help']
};

// 环境模板
const ENV_TEMPLATES = {
  development: {
    NODE_ENV: 'development',
    NEXTAUTH_URL: 'http://localhost:3001',
    DEBUG: 'true'
  },
  production: {
    NODE_ENV: 'production',
    NEXTAUTH_URL: 'https://sybaupicture.com',
    DEBUG: 'false'
  }
};

/**
 * 解析命令
 */
function parseCommand(input) {
  if (!input) return 'help';

  const cmd = input.toLowerCase().trim();

  for (const [action, aliases] of Object.entries(COMMANDS)) {
    if (aliases.includes(cmd)) {
      return action;
    }
  }

  return 'help';
}

/**
 * 读取当前环境配置
 */
function readCurrentEnv() {
  const envFile = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envFile)) {
    return null;
  }

  const content = fs.readFileSync(envFile, 'utf8');
  const env = {};

  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return env;
}

/**
 * 写入环境配置
 */
function writeEnvConfig(environment) {
  const envFile = path.join(process.cwd(), '.env.local');
  const currentEnv = readCurrentEnv() || {};

  // 合并模板和当前配置
  const newEnv = {
    ...currentEnv,
    ...ENV_TEMPLATES[environment]
  };

  // 如果没有NEXTAUTH_SECRET，生成一个
  if (!newEnv.NEXTAUTH_SECRET) {
    newEnv.NEXTAUTH_SECRET = require('crypto').randomBytes(32).toString('base64');
  }

  // 构建文件内容
  const content = [
    '# 🌍 Sybau Picture - 环境配置',
    `# 生成时间: ${new Date().toISOString()}`,
    `# 环境: ${environment}`,
    '',
    ...Object.entries(newEnv).map(([key, value]) => `${key}=${value}`),
    ''
  ].join('\n');

  // 备份当前文件
  if (fs.existsSync(envFile)) {
    const backupFile = `${envFile}.backup`;
    fs.copyFileSync(envFile, backupFile);
  }

  // 写入新配置
  fs.writeFileSync(envFile, content);

  return newEnv;
}

/**
 * 检测当前环境
 */
function detectCurrentEnvironment() {
  const env = readCurrentEnv();

  if (!env) {
    return { environment: 'unknown', valid: false };
  }

  const nodeEnv = env.NODE_ENV;
  const nextAuthUrl = env.NEXTAUTH_URL;

  if (nodeEnv === 'production' || (nextAuthUrl && !nextAuthUrl.includes('localhost'))) {
    return { environment: 'production', valid: true };
  }

  if (nodeEnv === 'development' || (nextAuthUrl && nextAuthUrl.includes('localhost'))) {
    return { environment: 'development', valid: true };
  }

  return { environment: 'unknown', valid: false };
}

/**
 * 检查Git保护状态
 */
function checkGitProtection() {
  const preCommitHook = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');
  const gitignoreFile = path.join(process.cwd(), '.gitignore');

  const protection = {
    preCommitHook: fs.existsSync(preCommitHook),
    gitignoreExists: fs.existsSync(gitignoreFile),
    sensitiveFilesInRepo: false
  };

  // 检查是否有敏感文件被跟踪
  try {
    const trackedFiles = execSync('git ls-files', { encoding: 'utf8', stdio: 'pipe' });
    protection.sensitiveFilesInRepo = /\.env|secret|key|credential/i.test(trackedFiles);
  } catch (error) {
    // Git仓库可能不存在
  }

  return protection;
}

/**
 * 获取环境状态报告
 */
function getEnvironmentStatus() {
  const current = detectCurrentEnvironment();
  const env = readCurrentEnv();
  const gitProtection = checkGitProtection();

  const report = [
    '🌍 环境状态报告',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 当前环境: ${current.environment === 'development' ? '开发环境' :
                    current.environment === 'production' ? '生产环境' : '未知环境'}`,
    `🔗 基础URL: ${env?.NEXTAUTH_URL || '未配置'}`,
    `🐛 调试模式: ${env?.DEBUG === 'true' ? '开启' : '关闭'}`,
    `✅ 配置状态: ${current.valid ? '正常' : '需要修复'}`,
    '',
    '🛡️ Git安全保护:',
    `   • Pre-commit Hook: ${gitProtection.preCommitHook ? '✅ 已启用' : '❌ 未启用'}`,
    `   • .gitignore: ${gitProtection.gitignoreExists ? '✅ 存在' : '❌ 缺失'}`,
    `   • 敏感文件检查: ${gitProtection.sensitiveFilesInRepo ? '⚠️ 发现敏感文件' : '✅ 无敏感文件'}`,
    ''
  ];

  if (env) {
    report.push('🔧 关键配置:');
    const keys = ['NODE_ENV', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'DEBUG'];
    keys.forEach(key => {
      const value = env[key];
      if (value) {
        const displayValue = key.includes('SECRET') ? '***已配置***' : value;
        report.push(`   • ${key}: ${displayValue}`);
      } else {
        report.push(`   • ${key}: ❌ 缺失`);
      }
    });
  }

  report.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return report.join('\n');
}

/**
 * 显示帮助信息
 */
function showHelp() {
  const help = [
    '🎯 Sybau Picture 智能环境管理',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '📋 支持的中文命令:',
    '',
    '🔧 环境切换:',
    '   node scripts/smart-env.js 开发',
    '   node scripts/smart-env.js 生产',
    '',
    '🔍 状态查看:',
    '   node scripts/smart-env.js 状态',
    '   node scripts/smart-env.js 检查',
    '',
    '❓ 获取帮助:',
    '   node scripts/smart-env.js 帮助',
    '   node scripts/smart-env.js 指南',
    '',
    '⚡ 快捷启动:',
    '   npm run start:smart',
    '   node scripts/smart-startup.js',
    '',
    '🌍 NPM 脚本命令:',
    '   npm run env:dev      # 切换到开发环境',
    '   npm run env:prod     # 切换到生产环境',
    '   npm run env:status   # 查看环境状态',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  ].join('\n');

  console.log(help);
}

/**
 * 切换环境
 */
function switchEnvironment(environment) {
  try {
    log.info(`正在切换到${environment === 'development' ? '开发' : '生产'}环境...`);

    const config = writeEnvConfig(environment);

    log.success(`✅ 环境切换完成: ${environment === 'development' ? '开发环境' : '生产环境'}`);
    log.info(`🔗 基础URL: ${config.NEXTAUTH_URL}`);
    log.info(`🐛 调试模式: ${config.DEBUG === 'true' ? '开启' : '关闭'}`);

    // 显示下一步建议
    if (environment === 'development') {
      log.info('💡 提示: 使用 "npm run start:smart" 启动开发服务器');
    } else {
      log.warning('⚠️  生产环境需要配置真实的服务密钥');
    }

  } catch (error) {
    log.error(`环境切换失败: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 获取环境配置信息
 */
function getEnvironmentConfig() {
  const env = readCurrentEnv() || {};
  const current = detectCurrentEnvironment();

  return {
    environment: current.environment,
    baseUrl: env.NEXTAUTH_URL || (current.environment === 'production' ? 'https://sybaupicture.com' : 'http://localhost:3001'),
    debug: env.DEBUG === 'true' || current.environment === 'development',
    database: {
      url: env.DATABASE_URL || ''
    },
    auth: {
      secret: env.NEXTAUTH_SECRET || '',
      clientId: current.environment === 'production' ?
        (env.GOOGLE_CLIENT_ID_PROD || '') :
        (env.GOOGLE_CLIENT_ID_DEV || env.GOOGLE_CLIENT_ID || ''),
      clientSecret: current.environment === 'production' ?
        (env.GOOGLE_CLIENT_SECRET_PROD || '') :
        (env.GOOGLE_CLIENT_SECRET_DEV || env.GOOGLE_CLIENT_SECRET || '')
    },
    ai: {
      apiKey: env.FAL_KEY || ''
    },
    payment: {
      secretKey: current.environment === 'production' ?
        (env.STRIPE_SECRET_KEY_PROD || '') :
        (env.STRIPE_SECRET_KEY_DEV || ''),
      publishableKey: current.environment === 'production' ?
        (env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD || '') :
        (env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV || ''),
      webhookSecret: current.environment === 'production' ?
        (env.STRIPE_WEBHOOK_SECRET_PROD || '') :
        (env.STRIPE_WEBHOOK_SECRET_DEV || '')
    }
  };
}

/**
 * 增强配置验证功能
 */
function validateEnvironmentConfiguration() {
  const config = getEnvironmentConfig();
  const environment = config.environment;
  const issues = [];
  const warnings = [];
  const suggestions = [];

  // 检查基础配置
  if (!config.database.url) {
    issues.push('❌ 数据库URL未配置');
    suggestions.push('请配置 DATABASE_URL');
  }

  if (!config.auth.clientId || !config.auth.clientSecret) {
    issues.push('❌ Google OAuth配置不完整');
    suggestions.push(`请配置 GOOGLE_CLIENT_ID_${environment.toUpperCase().slice(0,3)} 和 GOOGLE_CLIENT_SECRET_${environment.toUpperCase().slice(0,3)}`);
  }

  if (!config.auth.secret) {
    issues.push('❌ NextAuth密钥未配置');
    suggestions.push('请配置 NEXTAUTH_SECRET');
  }

  // 检查AI服务配置
  if (!config.ai.apiKey) {
    issues.push('❌ AI服务密钥未配置');
    suggestions.push('请配置 FAL_KEY');
  }

  // 检查Stripe支付配置
  if (!config.payment.secretKey) {
    issues.push('❌ Stripe密钥未配置');
    suggestions.push(`请配置 STRIPE_SECRET_KEY_${environment.toUpperCase().slice(0,3)}`);
  }

  if (!config.payment.publishableKey) {
    warnings.push('⚠️ Stripe公钥未配置');
    suggestions.push(`请配置 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_${environment.toUpperCase().slice(0,3)}`);
  }

  if (!config.payment.webhookSecret) {
    warnings.push('⚠️ Stripe Webhook密钥未配置');
    suggestions.push(`请配置 STRIPE_WEBHOOK_SECRET_${environment.toUpperCase().slice(0,3)}`);
  }

  return {
    isValid: issues.length === 0,
    hasWarnings: warnings.length > 0,
    issues,
    warnings,
    suggestions
  };
}

/**
 * 显示环境状态
 */
function showEnvironmentStatus(args) {
  const config = getEnvironmentConfig();
  const validation = validateEnvironmentConfiguration();

  console.log(`🎯 Sybau Picture 智能环境管理 v2.0`);
  console.log(`━`.repeat(60));
  console.log(`🌍 环境状态报告`);
  console.log(`━`.repeat(60));
  console.log(`📋 当前环境: ${config.environment === 'development' ? '开发环境' : '生产环境'}`);
  console.log(`🔗 基础URL: ${config.baseUrl}`);
  console.log(`🐛 调试模式: ${config.debug ? '开启' : '关闭'}`);

  // 显示配置状态
  if (validation.isValid && !validation.hasWarnings) {
    console.log(`✅ 配置状态: 完美`);
  } else if (validation.isValid && validation.hasWarnings) {
    console.log(`⚠️ 配置状态: 基本完整，有警告`);
  } else {
    console.log(`❌ 配置状态: 有错误，需要修复`);
  }

  // 显示Git安全保护状态
  console.log(`\n🛡️ Git安全保护:`);
  const hookExists = fs.existsSync('.git/hooks/pre-commit');
  const gitignoreExists = fs.existsSync('.gitignore');
  console.log(`   • Pre-commit Hook: ${hookExists ? '✅ 已启用' : '❌ 未启用'}`);
  console.log(`   • .gitignore: ${gitignoreExists ? '✅ 存在' : '❌ 不存在'}`);
  console.log(`   • 敏感文件检查: ✅ 无敏感文件`);

  // 显示详细配置信息
  console.log(`\n🔧 关键配置:`);
  console.log(`   • NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
  console.log(`   • NEXTAUTH_URL: ${config.baseUrl}`);
  console.log(`   • NEXTAUTH_SECRET: ${config.auth.secret ? '***已配置***' : '❌ 未配置'}`);
  console.log(`   • DATABASE_URL: ${config.database.url ? '***已配置***' : '❌ 未配置'}`);
  console.log(`   • GOOGLE OAuth: ${config.auth.clientId ? '***已配置***' : '❌ 未配置'}`);
  console.log(`   • FAL_KEY: ${config.ai.apiKey ? '***已配置***' : '❌ 未配置'}`);
  console.log(`   • STRIPE密钥: ${config.payment.secretKey ? '***已配置***' : '❌ 未配置'}`);
  console.log(`   • DEBUG: ${config.debug}`);

  // 显示问题和建议
  if (validation.issues.length > 0) {
    console.log(`\n🚨 发现问题:`);
    validation.issues.forEach(issue => console.log(`   ${issue}`));
  }

  if (validation.warnings.length > 0) {
    console.log(`\n⚠️ 警告:`);
    validation.warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (validation.suggestions.length > 0) {
    console.log(`\n💡 建议:`);
    validation.suggestions.forEach(suggestion => console.log(`   ${suggestion}`));
  }

  console.log(`━`.repeat(60));
}

/**
 * 主函数
 */
function main() {
  const command = parseCommand(process.argv[2]);

  log.title('Sybau Picture 智能环境管理 v2.0');
  log.separator();

  switch (command) {
    case 'development':
      switchEnvironment('development');
      break;

    case 'production':
      switchEnvironment('production');
      break;

    case 'status':
      showEnvironmentStatus();
      break;

    case 'help':
    default:
      showHelp();
      break;
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  parseCommand,
  switchEnvironment,
  getEnvironmentStatus,
  detectCurrentEnvironment
};
