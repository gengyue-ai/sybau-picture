#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 🛡️ Sybau Picture - 增强版Git安全管理工具
 * 彻底清理Git历史中的敏感信息，智能检测和防护
 */

// 日志工具
const log = {
  title: (msg) => console.log(`\n🛡️ ${msg}`),
  separator: () => console.log('━'.repeat(60)),
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  step: (num, msg) => console.log(`\n📋 步骤${num}: ${msg}`)
};

// 敏感信息检测配置
const SECURITY_CONFIG = {
  // 敏感文件模式
  sensitiveFilePatterns: [
    /\.env.*$/,
    /.*secret.*$/,
    /.*key.*$/,
    /.*credential.*$/,
    /.*token.*$/,
    /.*\.pem$/,
    /.*\.p12$/,
    /.*\.pfx$/
  ],

  // 敏感内容模式 - 更智能的检测
  sensitiveContentPatterns: [
    // 真实的Stripe密钥格式
    /sk_live_[a-zA-Z0-9]{99}/g,
    /pk_live_[a-zA-Z0-9]{99}/g,
    /sk_test_[a-zA-Z0-9]{99}/g,
    /pk_test_[a-zA-Z0-9]{99}/g,

    // 真实的Google OAuth格式
    /[0-9]+-[a-zA-Z0-9_]{32}\.apps\.googleusercontent\.com/g,
    /GOCSPX-[a-zA-Z0-9_-]{28}/g,

    // 真实的API密钥格式
    /fal_[a-zA-Z0-9]{32}/g,

    // JWT tokens
    /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,

    // 数据库连接字符串
    /postgresql:\/\/[^@]+:[^@]+@[^\/]+\/[^\s"']+/g,
    /mysql:\/\/[^@]+:[^@]+@[^\/]+\/[^\s"']+/g
  ],

  // 允许的占位符模式（不会被检测为敏感信息）
  allowedPlaceholders: [
    /\[.*\]/g,
    /<.*>/g,
    /\{.*\}/g,
    /your[-_].*[-_](key|secret|id|token)/gi,
    /example[-_].*[-_](key|secret|id|token)/gi,
    /test[-_].*[-_](key|secret|id|token)/gi,
    /\*\*\*.*\*\*\*/g
  ]
};

/**
 * 检查Git仓库状态
 */
function checkGitStatus() {
  try {
    execSync('git status', { stdio: 'pipe' });
    return true;
  } catch (error) {
    log.error('当前目录不是Git仓库');
    return false;
  }
}

/**
 * 获取所有涉及敏感文件的提交
 */
function getSensitiveCommits() {
  const sensitiveCommits = new Set();

  // 查找包含敏感文件的提交
  const sensitiveFiles = [
    '.env*',
    '*secret*',
    '*key*',
    '*credential*',
    '*.pem',
    '*.p12',
    '*.pfx'
  ];

  sensitiveFiles.forEach(pattern => {
    try {
      const output = execSync(`git log --all --format="%H" -- ${pattern}`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      output.split('\n').filter(line => line.trim()).forEach(commit => {
        sensitiveCommits.add(commit.trim());
      });
    } catch (error) {
      // 忽略没有匹配文件的情况
    }
  });

  return Array.from(sensitiveCommits);
}

/**
 * 扫描提交中的敏感内容
 */
function scanCommitForSensitiveContent(commitHash) {
  const issues = [];

  try {
    // 获取提交中的所有文件
    const files = execSync(`git show --name-only --format="" ${commitHash}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    }).split('\n').filter(line => line.trim());

    files.forEach(file => {
      try {
        // 获取文件内容
        const content = execSync(`git show ${commitHash}:${file}`, {
          encoding: 'utf8',
          stdio: 'pipe'
        });

        // 检测敏感内容
        SECURITY_CONFIG.sensitiveContentPatterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            // 检查是否是允许的占位符
            const isPlaceholder = SECURITY_CONFIG.allowedPlaceholders.some(placeholder =>
              matches.some(match => placeholder.test(match))
            );

            if (!isPlaceholder) {
              issues.push({
                commit: commitHash,
                file: file,
                type: 'sensitive_content',
                matches: matches.slice(0, 3) // 只显示前3个匹配
              });
            }
          }
        });

      } catch (error) {
        // 文件可能已被删除
      }
    });

  } catch (error) {
    log.warning(`无法扫描提交 ${commitHash}: ${error.message}`);
  }

  return issues;
}

/**
 * 生成完整的安全报告
 */
function generateSecurityReport() {
  log.step(1, '生成安全报告...');

  const report = {
    timestamp: new Date().toISOString(),
    sensitiveCommits: [],
    currentIssues: [],
    recommendations: []
  };

  // 获取敏感提交
  const sensitiveCommits = getSensitiveCommits();
  log.info(`发现 ${sensitiveCommits.length} 个可能包含敏感信息的提交`);

  // 扫描每个提交
  sensitiveCommits.forEach((commit, index) => {
    log.info(`扫描提交 ${index + 1}/${sensitiveCommits.length}: ${commit.substring(0, 8)}`);
    const issues = scanCommitForSensitiveContent(commit);

    if (issues.length > 0) {
      report.sensitiveCommits.push({
        commit: commit,
        issues: issues
      });
    }
  });

  // 检查当前工作目录
  const currentIssues = scanCurrentWorkingDirectory();
  report.currentIssues = currentIssues;

  // 生成建议
  if (report.sensitiveCommits.length > 0) {
    report.recommendations.push('需要清理Git历史中的敏感信息');
    report.recommendations.push('建议使用git filter-branch或BFG Repo-Cleaner');
  }

  if (report.currentIssues.length > 0) {
    report.recommendations.push('当前工作目录存在敏感文件，需要清理');
  }

  // 保存报告
  const reportPath = path.join(process.cwd(), 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

/**
 * 扫描当前工作目录
 */
function scanCurrentWorkingDirectory() {
  const issues = [];

  try {
    // 获取所有跟踪的文件
    const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.trim());

    trackedFiles.forEach(file => {
      if (fs.existsSync(file)) {
        // 检查文件名
        const isSensitiveFile = SECURITY_CONFIG.sensitiveFilePatterns.some(pattern =>
          pattern.test(file)
        );

        if (isSensitiveFile) {
          issues.push({
            file: file,
            type: 'sensitive_file',
            reason: '文件名包含敏感信息'
          });
        }

        // 检查文件内容
        try {
          const content = fs.readFileSync(file, 'utf8');
          SECURITY_CONFIG.sensitiveContentPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              const isPlaceholder = SECURITY_CONFIG.allowedPlaceholders.some(placeholder =>
                matches.some(match => placeholder.test(match))
              );

              if (!isPlaceholder) {
                issues.push({
                  file: file,
                  type: 'sensitive_content',
                  matches: matches.slice(0, 3)
                });
              }
            }
          });
        } catch (error) {
          // 无法读取文件
        }
      }
    });

  } catch (error) {
    log.warning(`扫描工作目录失败: ${error.message}`);
  }

  return issues;
}

/**
 * 执行彻底的Git历史清理
 */
function performThoroughCleanup() {
  log.step(2, '执行彻底的Git历史清理...');

  // 创建备份分支
  const backupBranch = `backup-before-thorough-cleanup-${Date.now()}`;
  try {
    execSync(`git branch ${backupBranch}`, { stdio: 'pipe' });
    log.success(`备份分支已创建: ${backupBranch}`);
  } catch (error) {
    log.warning('备份分支创建失败，继续清理...');
  }

  // 定义要清理的文件模式
  const filePatternsToRemove = [
    '.env*',
    '**/.env*',
    '*secret*',
    '*key*',
    '*credential*',
    '*.pem',
    '*.p12',
    '*.pfx',
    'FINAL_DEPLOYMENT_SUMMARY.md',
    'VERCEL_DEPLOYMENT_STATUS.md',
    'VERCEL_DEPLOYMENT_CHECKLIST.md',
    'production-deployment-checklist.md',
    'migrate-to-new-db.js'
  ];

  // 使用git filter-branch清理历史
  filePatternsToRemove.forEach(pattern => {
    try {
      log.info(`清理文件模式: ${pattern}`);

      const command = `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch '${pattern}'" --prune-empty --tag-name-filter cat -- --all`;

      execSync(command, {
        stdio: 'pipe',
        timeout: 300000 // 5分钟超时
      });

    } catch (error) {
      log.warning(`清理 ${pattern} 时出现警告: ${error.message}`);
    }
  });

  // 清理引用
  try {
    execSync('git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d', { stdio: 'pipe' });
    execSync('git reflog expire --expire=now --all', { stdio: 'pipe' });
    execSync('git gc --prune=now --aggressive', { stdio: 'pipe' });
    log.success('Git引用清理完成');
  } catch (error) {
    log.warning('Git引用清理部分失败，但历史已清理');
  }
}

/**
 * 优化Pre-commit Hook
 */
function optimizePreCommitHook() {
  log.step(3, '优化Pre-commit Hook...');

  const hookPath = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');

  const optimizedHook = `#!/bin/sh
# 🛡️ Sybau Picture - 智能Git预提交安全检查
# 增强版：更智能的敏感信息检测

echo "🔍 正在执行智能安全检查..."

# 检查是否包含敏感信息的文件（排除文档和配置模板）
SENSITIVE_FILES=$(git diff --cached --name-only | grep -E "\\.(env|secret|key|credential)$" | grep -v -E "\\.(template|example|sample|md)$")

if [ ! -z "$SENSITIVE_FILES" ]; then
    echo "❌ 检测到敏感文件，拒绝提交:"
    echo "$SENSITIVE_FILES"
    echo ""
    echo "💡 解决方案:"
    echo "1. 将敏感文件添加到 .gitignore"
    echo "2. 使用 git rm --cached <file> 移除已暂存的文件"
    echo "3. 确保敏感信息存储在环境变量中"
    exit 1
fi

# 智能检测真实的敏感信息（排除占位符和文档）
for file in $(git diff --cached --name-only --diff-filter=ACM); do
    if [ -f "$file" ]; then
        # 跳过文档文件
        if echo "$file" | grep -qE "\\.(md|txt|json|template)$"; then
            continue
        fi

        # 检查真实的Stripe密钥格式
        if grep -qE "sk_(live|test)_[a-zA-Z0-9]{99}" "$file" 2>/dev/null; then
            echo "❌ 检测到真实的Stripe密钥在 $file"
            exit 1
        fi

        # 检查真实的Google OAuth客户端密钥格式
        if grep -qE "GOCSPX-[a-zA-Z0-9_-]{28}" "$file" 2>/dev/null; then
            echo "❌ 检测到真实的Google OAuth客户端密钥在 $file"
            exit 1
        fi

        # 检查真实的Google OAuth客户端ID格式
        if grep -qE "[0-9]{12}-[a-zA-Z0-9]{32}\\.apps\\.googleusercontent\\.com" "$file" 2>/dev/null; then
            echo "❌ 检测到真实的Google OAuth客户端ID在 $file"
            exit 1
        fi

        # 检查真实的数据库连接字符串
        if grep -qE "postgresql://[^@]+:[^@]+@[^/]+/" "$file" 2>/dev/null; then
            echo "❌ 检测到真实的数据库连接字符串在 $file"
            exit 1
        fi

        # 检查Fal AI密钥
        if grep -qE "fal_[a-zA-Z0-9]{32}" "$file" 2>/dev/null; then
            echo "❌ 检测到真实的Fal AI密钥在 $file"
            exit 1
        fi
    fi
done

echo "✅ 智能安全检查通过，允许提交"
exit 0
`;

  fs.writeFileSync(hookPath, optimizedHook);

  // 设置可执行权限
  try {
    fs.chmodSync(hookPath, 0o755);
    log.success('Pre-commit Hook已优化');
  } catch (error) {
    log.warning('设置Pre-commit Hook权限失败');
  }
}

/**
 * 主函数
 */
function main() {
  const command = process.argv[2];

  log.title('Sybau Picture - 增强版Git安全管理工具');
  log.separator();

  if (!checkGitStatus()) {
    process.exit(1);
  }

  switch (command) {
    case 'scan':
    case '扫描':
      const report = generateSecurityReport();
      console.log('\n📊 安全报告:');
      console.log(`   • 敏感提交: ${report.sensitiveCommits.length}`);
      console.log(`   • 当前问题: ${report.currentIssues.length}`);
      console.log(`   • 建议: ${report.recommendations.length}`);

      if (report.currentIssues.length > 0) {
        console.log('\n⚠️ 当前问题:');
        report.currentIssues.forEach(issue => {
          console.log(`   - ${issue.file}: ${issue.reason || issue.type}`);
        });
      }

      console.log('\n📋 详细报告已保存到: security-report.json');
      break;

    case 'clean':
    case '清理':
      console.log('⚠️ 警告：此操作将彻底重写Git历史！');
      console.log('📋 将清理所有敏感文件和信息');
      console.log('🤔 确定要继续吗？输入 "yes" 确认:');

      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('', (answer) => {
        if (answer.toLowerCase() === 'yes') {
          performThoroughCleanup();
          optimizePreCommitHook();
          log.success('彻底清理完成！');
          console.log('\n📋 下一步操作:');
          console.log('   1. 运行: git status 检查状态');
          console.log('   2. 测试: npm run build 确保功能正常');
          console.log('   3. 推送: git push --force-with-lease origin master');
        } else {
          log.info('清理操作已取消');
        }
        rl.close();
      });
      break;

    case 'optimize':
    case '优化':
      optimizePreCommitHook();
      log.success('Pre-commit Hook已优化');
      break;

    default:
      console.log('\n📋 可用命令:');
      console.log('   node scripts/advanced-git-security.js scan   # 扫描敏感信息');
      console.log('   node scripts/advanced-git-security.js clean  # 彻底清理');
      console.log('   node scripts/advanced-git-security.js optimize # 优化检查规则');
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateSecurityReport,
  performThoroughCleanup,
  optimizePreCommitHook,
  SECURITY_CONFIG
};
