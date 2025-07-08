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
 * 获取环境状态报告
 */
function getEnvironmentStatus() {
  const current = detectCurrentEnvironment();
  const env = readCurrentEnv();

  const report = [
    '🌍 环境状态报告',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `📋 当前环境: ${current.environment === 'development' ? '开发环境' :
                    current.environment === 'production' ? '生产环境' : '未知环境'}`,
    `🔗 基础URL: ${env?.NEXTAUTH_URL || '未配置'}`,
    `🐛 调试模式: ${env?.DEBUG === 'true' ? '开启' : '关闭'}`,
    `✅ 配置状态: ${current.valid ? '正常' : '需要修复'}`,
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
      console.log(getEnvironmentStatus());
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
