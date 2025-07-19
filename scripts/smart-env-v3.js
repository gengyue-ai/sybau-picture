#!/usr/bin/env node

/**
 * 🎯 Sybau Picture - 智能环境管理系统 v3.0
 *
 * 🔧 全面重构，解决所有已知问题：
 * - 真正的环境隔离和切换
 * - 完整的敏感信息保护
 * - 智能配置验证和修复
 * - 无缝的构建集成
 * - 中文命令支持
 *
 * 支持命令：
 * - 开发/dev: 切换开发环境
 * - 生产/prod: 切换生产环境
 * - 状态/status: 查看环境状态
 * - 验证/validate: 验证配置完整性
 * - 修复/fix: 自动修复配置问题
 * - 安全/security: Git安全检查
 * - 清理/clean: 清理敏感信息
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// 彩色输出工具
const colors = {
  reset: '\x1b[0m', bright: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m'
};

const log = {
  title: (msg) => console.log(`${colors.bright}${colors.magenta}🎯 ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  debug: (msg) => console.log(`${colors.dim}🔍 ${msg}${colors.reset}`),
  separator: () => console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
};

// 命令映射
const COMMANDS = {
  development: ['开发', 'dev', 'development', 'develop'],
  production: ['生产', 'prod', 'production', 'build'],
  status: ['状态', 'status', '检查', 'check', 'info'],
  validate: ['验证', 'validate', '检验', 'verify'],
  fix: ['修复', 'fix', '修理', 'repair', 'auto-fix'],
  security: ['安全', 'security', '保护', 'protect'],
  clean: ['清理', 'clean', '清除', 'cleanup'],
  help: ['帮助', 'help', '指南', 'guide', '-h', '--help']
};

// 环境配置模板
const ENV_TEMPLATES = {
  development: {
    // 基础配置
    NODE_ENV: 'development',
    NEXTAUTH_URL: 'http://localhost:3001',
    DEBUG: 'true',

    // 数据库配置
    DATABASE_URL: '[DEV_DATABASE_URL_HERE]',

    // 认证配置
    NEXTAUTH_SECRET: '[AUTO_GENERATED]',
    GOOGLE_CLIENT_ID: '[DEV_GOOGLE_CLIENT_ID]',
    GOOGLE_CLIENT_SECRET: '[DEV_GOOGLE_CLIENT_SECRET]',

    // AI服务
    FAL_KEY: '[DEV_FAL_KEY]',

    // 支付配置
    STRIPE_SECRET_KEY: '[DEV_STRIPE_SECRET_KEY]',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: '[DEV_STRIPE_PUBLISHABLE_KEY]',
    STRIPE_WEBHOOK_SECRET: '[DEV_STRIPE_WEBHOOK_SECRET]',

    // 其他服务
    RESEND_API_KEY: '[DEV_RESEND_API_KEY]',
    FROM_EMAIL_ADDRESS: 'dev@localhost'
  },

  production: {
    // 基础配置
    NODE_ENV: 'production',
    NEXTAUTH_URL: 'https://sybaupicture.com',
    DEBUG: 'false',

    // 数据库配置
    DATABASE_URL: '[PROD_DATABASE_URL_HERE]',

    // 认证配置
    NEXTAUTH_SECRET: '[AUTO_GENERATED]',
    GOOGLE_CLIENT_ID: '[PROD_GOOGLE_CLIENT_ID]',
    GOOGLE_CLIENT_SECRET: '[PROD_GOOGLE_CLIENT_SECRET]',

    // AI服务
    FAL_KEY: '[PROD_FAL_KEY]',

    // 支付配置
    STRIPE_SECRET_KEY: '[PROD_STRIPE_SECRET_KEY]',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: '[PROD_STRIPE_PUBLISHABLE_KEY]',
    STRIPE_WEBHOOK_SECRET: '[PROD_STRIPE_WEBHOOK_SECRET]',

    // 其他服务
    RESEND_API_KEY: '[PROD_RESEND_API_KEY]',
    FROM_EMAIL_ADDRESS: 'noreply@sybaupicture.com'
  }
};

// 构建时必需的环境变量
const REQUIRED_FOR_BUILD = [
  'NODE_ENV',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FAL_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

// 敏感信息模式
const SENSITIVE_PATTERNS = [
  /sk_live_[a-zA-Z0-9]{99}/g,  // Stripe live keys
  /sk_test_[a-zA-Z0-9]{99}/g,  // Stripe test keys
  /pk_live_[a-zA-Z0-9]{99}/g,  // Stripe live publishable keys
  /pk_test_[a-zA-Z0-9]{99}/g,  // Stripe test publishable keys
  /whsec_[a-zA-Z0-9_]{32,}/g,  // Stripe webhook secrets
  /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, // UUIDs that might be keys
  /postgresql:\/\/[^@]+:[^@]+@[^/]+\/[^\s"']+/g, // Database URLs with credentials
  /mysql:\/\/[^@]+:[^@]+@[^/]+\/[^\s"']+/g,      // MySQL URLs with credentials
  /mongodb:\/\/[^@]+:[^@]+@[^/]+\/[^\s"']+/g,    // MongoDB URLs with credentials
  /[A-Za-z0-9]{40,}/g  // Long strings that might be API keys
];

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
 * 读取环境文件
 */
function readEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  content.split('\n').forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        const value = trimmed.substring(equalIndex + 1).trim();
        // 移除引号
        env[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  return env;
}

/**
 * 写入环境文件
 */
function writeEnvFile(filename, envObj, comment = '') {
  const filePath = path.join(process.cwd(), filename);

  // 备份现有文件
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    log.debug(`备份 ${filename} 到 ${path.basename(backupPath)}`);
  }

  // 构建文件内容
  const lines = [
    '# 🎭 Sybau Picture - 智能环境配置 v3.0',
    comment ? `# ${comment}` : '# 自动生成的环境配置',
    `# 生成时间: ${new Date().toISOString()}`,
    `# 环境: ${envObj.NODE_ENV || 'unknown'}`,
    '',
    ...Object.entries(envObj).map(([key, value]) => {
      // 确保值被正确引用
      const quotedValue = value.includes(' ') || value.includes('=') ? `"${value}"` : value;
      return `${key}=${quotedValue}`;
    }),
    ''
  ];

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  log.success(`已写入 ${filename}`);
}

/**
 * 生成安全的密钥
 */
function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

/**
 * 检查敏感信息
 */
function containsSensitiveInfo(text) {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * 脱敏处理
 */
function sanitizeValue(value) {
  if (typeof value !== 'string') return value;

  // 如果包含敏感信息，进行脱敏
  if (containsSensitiveInfo(value)) {
    if (value.length > 20) {
      return `${value.substring(0, 8)}***${value.substring(value.length - 4)}`;
    } else if (value.length > 8) {
      return `${value.substring(0, 4)}***`;
    } else {
      return '***';
    }
  }

  return value;
}

/**
 * 智能环境切换
 */
function switchEnvironment(targetEnv) {
  log.title(`智能环境切换 → ${targetEnv === 'development' ? '开发环境' : '生产环境'}`);
  log.separator();

  try {
    // 1. 读取现有配置
    log.info('步骤 1/5: 读取现有配置...');
    const currentEnv = readEnvFile('.env');
    const currentLocal = readEnvFile('.env.local');

    // 2. 合并模板配置
    log.info('步骤 2/5: 应用环境模板...');
    const template = { ...ENV_TEMPLATES[targetEnv] };

    // 3. 智能保留现有值
    log.info('步骤 3/5: 智能保留现有配置...');
    const mergedConfig = { ...template };

    // 保留现有的非占位符值
    Object.keys(mergedConfig).forEach(key => {
      const currentValue = currentLocal[key] || currentEnv[key];
      if (currentValue &&
          !currentValue.includes('[') &&
          !currentValue.includes('placeholder') &&
          !currentValue.includes('AUTO_GENERATED')) {
        mergedConfig[key] = currentValue;
      }
    });

    // 4. 生成必需的密钥
    log.info('步骤 4/5: 生成安全密钥...');
    if (mergedConfig.NEXTAUTH_SECRET === '[AUTO_GENERATED]') {
      mergedConfig.NEXTAUTH_SECRET = generateSecureKey();
      log.success('生成新的 NEXTAUTH_SECRET');
    }

    // 5. 写入配置文件
    log.info('步骤 5/5: 写入环境配置...');

    // 写入主配置文件
    writeEnvFile('.env', mergedConfig, `${targetEnv} 环境主配置`);

    // 写入本地配置文件（覆盖优先级更高）
    const localConfig = {
      NODE_ENV: mergedConfig.NODE_ENV,
      NEXTAUTH_URL: mergedConfig.NEXTAUTH_URL,
      DEBUG: mergedConfig.DEBUG
    };
    writeEnvFile('.env.local', localConfig, `${targetEnv} 环境本地配置`);

    log.separator();
    log.success(`✅ 环境切换完成！已切换到 ${targetEnv === 'development' ? '开发环境' : '生产环境'}`);

    // 验证配置
    const validation = validateConfiguration();
    if (!validation.isValid) {
      log.warning('配置验证发现问题，建议运行: node scripts/smart-env-v3.js 修复');
    }

  } catch (error) {
    log.error(`环境切换失败: ${error.message}`);
    throw error;
  }
}

/**
 * 验证配置完整性
 */
function validateConfiguration() {
  log.title('智能配置验证');
  log.separator();

  const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local') };
  const issues = [];
  const warnings = [];
  const suggestions = [];

  // 检查必需的环境变量
  log.info('检查必需的环境变量...');
  REQUIRED_FOR_BUILD.forEach(key => {
    const value = env[key];
    if (!value) {
      issues.push(`❌ 缺少必需变量: ${key}`);
    } else if (value.includes('[') || value.includes('placeholder')) {
      issues.push(`❌ 变量未配置: ${key} (仍为占位符)`);
    }
  });

  // 检查环境一致性
  log.info('检查环境一致性...');
  const nodeEnv = env.NODE_ENV;
  const nextAuthUrl = env.NEXTAUTH_URL;

  if (nodeEnv === 'development' && nextAuthUrl && !nextAuthUrl.includes('localhost')) {
    warnings.push('⚠️ 开发环境配置了生产域名');
    suggestions.push('建议检查 NEXTAUTH_URL 配置');
  }

  if (nodeEnv === 'production' && nextAuthUrl && nextAuthUrl.includes('localhost')) {
    issues.push('❌ 生产环境配置了本地域名');
    suggestions.push('请更新 NEXTAUTH_URL 为生产域名');
  }

  // 检查敏感信息安全
  log.info('检查敏感信息安全...');
  Object.entries(env).forEach(([key, value]) => {
    if (containsSensitiveInfo(value)) {
      warnings.push(`⚠️ 检测到敏感信息: ${key}`);
    }
  });

  // 显示结果
  log.separator();
  if (issues.length === 0 && warnings.length === 0) {
    log.success('🎉 配置验证通过！所有检查都OK');
  } else {
    if (issues.length > 0) {
      log.error('发现严重问题:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }

    if (warnings.length > 0) {
      log.warning('发现警告:');
      warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (suggestions.length > 0) {
      log.info('建议:');
      suggestions.forEach(suggestion => console.log(`   💡 ${suggestion}`));
    }
  }

  return {
    isValid: issues.length === 0,
    hasWarnings: warnings.length > 0,
    issues,
    warnings,
    suggestions,
    environment: nodeEnv
  };
}

/**
 * 自动修复配置问题
 */
function autoFixConfiguration() {
  log.title('智能配置修复');
  log.separator();

  const validation = validateConfiguration();
  if (validation.isValid && !validation.hasWarnings) {
    log.success('配置已完美，无需修复！');
    return;
  }

  log.info('开始自动修复配置问题...');

  const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local') };
  let fixed = false;

  // 修复缺失的密钥
  if (!env.NEXTAUTH_SECRET || env.NEXTAUTH_SECRET.includes('[')) {
    env.NEXTAUTH_SECRET = generateSecureKey();
    log.success('生成新的 NEXTAUTH_SECRET');
    fixed = true;
  }

  // 修复环境一致性问题
  if (env.NODE_ENV === 'development' && env.NEXTAUTH_URL && !env.NEXTAUTH_URL.includes('localhost')) {
    env.NEXTAUTH_URL = 'http://localhost:3001';
    log.success('修复开发环境域名配置');
    fixed = true;
  }

  if (env.NODE_ENV === 'production' && env.NEXTAUTH_URL && env.NEXTAUTH_URL.includes('localhost')) {
    env.NEXTAUTH_URL = 'https://sybaupicture.vercel.app';
    log.success('修复生产环境域名配置');
    fixed = true;
  }

  if (fixed) {
    writeEnvFile('.env', env, '自动修复的配置');
    log.success('配置修复完成！');
  } else {
    log.info('未发现可自动修复的问题');
  }
}

/**
 * Git安全检查
 */
function gitSecurityCheck() {
  log.title('Git安全检查');
  log.separator();

  const issues = [];
  const suggestions = [];

  // 检查 .gitignore
  log.info('检查 .gitignore 配置...');
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const requiredPatterns = ['.env*', '*.local', '*.backup'];

    requiredPatterns.forEach(pattern => {
      if (!gitignoreContent.includes(pattern)) {
        issues.push(`❌ .gitignore 缺少模式: ${pattern}`);
        suggestions.push(`添加 "${pattern}" 到 .gitignore`);
      }
    });
  } else {
    issues.push('❌ 缺少 .gitignore 文件');
    suggestions.push('创建 .gitignore 文件');
  }

  // 检查 pre-commit hook
  log.info('检查 pre-commit hook...');
  const preCommitPath = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');
  if (!fs.existsSync(preCommitPath)) {
    issues.push('❌ 缺少 pre-commit hook');
    suggestions.push('安装 pre-commit hook 以防止敏感信息提交');
  }

  // 检查已跟踪的敏感文件
  log.info('检查已跟踪的敏感文件...');
  try {
    const trackedFiles = execSync('git ls-files', { encoding: 'utf8', stdio: 'pipe' });
    const sensitiveFiles = trackedFiles.split('\n').filter(file =>
      /\.env|secret|key|credential|\.backup/.test(file)
    );

    if (sensitiveFiles.length > 0) {
      issues.push('❌ 发现已跟踪的敏感文件');
      sensitiveFiles.forEach(file => {
        suggestions.push(`移除 Git 跟踪: git rm --cached ${file}`);
      });
    }
  } catch (error) {
    log.warning('无法检查 Git 状态（可能不是 Git 仓库）');
  }

  // 显示结果
  log.separator();
  if (issues.length === 0) {
    log.success('🔒 Git安全检查通过！');
  } else {
    log.error('发现安全问题:');
    issues.forEach(issue => console.log(`   ${issue}`));

    log.info('建议:');
    suggestions.forEach(suggestion => console.log(`   💡 ${suggestion}`));
  }

  return { isSecure: issues.length === 0, issues, suggestions };
}

/**
 * 清理敏感信息
 */
function cleanSensitiveInfo() {
  log.title('清理敏感信息');
  log.separator();

  log.info('扫描项目中的敏感信息...');

  // 要检查的文件模式
  const checkPatterns = [
    '*.md', '*.txt', '*.js', '*.ts', '*.json', '*.yml', '*.yaml'
  ];

  let foundIssues = false;

  checkPatterns.forEach(pattern => {
    try {
      const files = execSync(`find . -name "${pattern}" -not -path "./node_modules/*" -not -path "./.git/*"`,
        { encoding: 'utf8', stdio: 'pipe' }).split('\n').filter(f => f);

      files.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          if (containsSensitiveInfo(content)) {
            log.warning(`发现敏感信息: ${file}`);
            foundIssues = true;
          }
        }
      });
    } catch (error) {
      // 忽略 find 命令错误
    }
  });

  if (!foundIssues) {
    log.success('✅ 未发现敏感信息泄露');
  } else {
    log.error('建议手动检查并清理上述文件中的敏感信息');
  }
}

/**
 * 显示环境状态
 */
function showStatus() {
  log.title('环境状态报告');
  log.separator();

  const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local') };
  const validation = validateConfiguration();

  // 基本信息
  console.log(`🌍 当前环境: ${env.NODE_ENV === 'development' ? '开发环境 🛠️' : '生产环境 🚀'}`);
  console.log(`🔗 应用URL: ${env.NEXTAUTH_URL}`);
  console.log(`🐛 调试模式: ${env.DEBUG === 'true' ? '开启' : '关闭'}`);

  // 配置状态
  console.log(`\n📋 配置状态:`);
  if (validation.isValid) {
    console.log(`   ✅ 配置完整性: 通过`);
  } else {
    console.log(`   ❌ 配置完整性: ${validation.issues.length} 个问题`);
  }

  // 关键配置
  console.log(`\n🔧 关键配置:`);
  const keyConfigs = [
    { key: 'DATABASE_URL', label: '数据库' },
    { key: 'GOOGLE_CLIENT_ID', label: 'Google OAuth' },
    { key: 'FAL_KEY', label: 'AI服务' },
    { key: 'STRIPE_SECRET_KEY', label: 'Stripe支付' },
    { key: 'NEXTAUTH_SECRET', label: '认证密钥' }
  ];

  keyConfigs.forEach(({ key, label }) => {
    const value = env[key];
    const status = value && !value.includes('[') && !value.includes('placeholder')
      ? '✅ 已配置'
      : '❌ 未配置';
    console.log(`   • ${label}: ${status}`);
  });

  // Git安全状态
  console.log(`\n🛡️ Git安全:`);
  const gitSecurity = gitSecurityCheck();
  console.log(`   • 安全状态: ${gitSecurity.isSecure ? '✅ 安全' : '❌ 有风险'}`);

  log.separator();

  // 建议
  if (!validation.isValid) {
    log.info('💡 建议运行: node scripts/smart-env-v3.js 修复');
  }
  if (!gitSecurity.isSecure) {
    log.info('💡 建议运行: node scripts/smart-env-v3.js 安全');
  }
}

/**
 * 显示帮助信息
 */
function showHelp() {
  log.title('智能环境管理系统 v3.0 - 使用指南');
  log.separator();

  console.log('📋 可用命令:');
  console.log('');
  console.log('🔧 环境切换:');
  console.log('   node scripts/smart-env-v3.js 开发     # 切换到开发环境');
  console.log('   node scripts/smart-env-v3.js 生产     # 切换到生产环境');
  console.log('');
  console.log('📊 状态管理:');
  console.log('   node scripts/smart-env-v3.js 状态     # 查看环境状态');
  console.log('   node scripts/smart-env-v3.js 验证     # 验证配置完整性');
  console.log('');
  console.log('🛠️ 维护工具:');
  console.log('   node scripts/smart-env-v3.js 修复     # 自动修复配置问题');
  console.log('   node scripts/smart-env-v3.js 安全     # Git安全检查');
  console.log('   node scripts/smart-env-v3.js 清理     # 清理敏感信息');
  console.log('');
  console.log('🎯 设计目标:');
  console.log('   • 真正的环境隔离和切换');
  console.log('   • 完整的敏感信息保护');
  console.log('   • 智能配置验证和修复');
  console.log('   • 无缝的构建集成');
  console.log('   • 中文命令支持');

  log.separator();
}

/**
 * 主函数
 */
function main() {
  const command = parseCommand(process.argv[2]);

  try {
    switch (command) {
      case 'development':
        switchEnvironment('development');
        break;

      case 'production':
        switchEnvironment('production');
        break;

      case 'status':
        showStatus();
        break;

      case 'validate':
        validateConfiguration();
        break;

      case 'fix':
        autoFixConfiguration();
        break;

      case 'security':
        gitSecurityCheck();
        break;

      case 'clean':
        cleanSensitiveInfo();
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    log.error(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = {
  parseCommand,
  switchEnvironment,
  validateConfiguration,
  autoFixConfiguration,
  gitSecurityCheck,
  cleanSensitiveInfo
};
