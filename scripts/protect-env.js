#!/usr/bin/env node
// 🔒 环境变量保护脚本 - 防止AI意外修改

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENV_FILES = [
  '.env.development.local',
  '.env.production.local',
  '.env.local'
];

const CHECKSUM_FILE = '.env.checksums.json';

/**
 * 计算文件的MD5校验和
 */
function calculateChecksum(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * 保存环境文件校验和
 */
function saveChecksums() {
  const checksums = {};
  
  ENV_FILES.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const checksum = calculateChecksum(filePath);
    if (checksum) {
      checksums[file] = {
        checksum,
        lastModified: fs.statSync(filePath).mtime.toISOString()
      };
    }
  });

  fs.writeFileSync(
    path.join(process.cwd(), CHECKSUM_FILE),
    JSON.stringify(checksums, null, 2)
  );

  console.log('✅ 环境文件校验和已保存');
}

/**
 * 验证环境文件完整性
 */
function verifyChecksums() {
  const checksumPath = path.join(process.cwd(), CHECKSUM_FILE);
  
  if (!fs.existsSync(checksumPath)) {
    console.log('⚠️  未找到校验和文件，创建新的校验和...');
    saveChecksums();
    return true;
  }

  const savedChecksums = JSON.parse(fs.readFileSync(checksumPath, 'utf8'));
  const issues = [];

  ENV_FILES.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(filePath)) {
      if (savedChecksums[file]) {
        issues.push(`❌ 文件 ${file} 被删除`);
      }
      return;
    }

    const currentChecksum = calculateChecksum(filePath);
    const savedData = savedChecksums[file];

    if (!savedData) {
      issues.push(`⚠️  新文件 ${file} 未记录校验和`);
      return;
    }

    if (currentChecksum !== savedData.checksum) {
      issues.push(`🚨 文件 ${file} 已被修改！`);
      issues.push(`   预期校验和: ${savedData.checksum}`);
      issues.push(`   当前校验和: ${currentChecksum}`);
      issues.push(`   上次修改时间: ${savedData.lastModified}`);
    }
  });

  if (issues.length > 0) {
    console.log('🔒 环境文件完整性检查失败：');
    issues.forEach(issue => console.log(issue));
    console.log('\n💡 如果这些修改是预期的，请运行: npm run env:save-checksums');
    return false;
  }

  console.log('✅ 环境文件完整性验证通过');
  return true;
}

/**
 * 恢复环境文件备份
 */
function restoreBackups() {
  const backupDir = path.join(process.cwd(), '.env-backups');
  
  if (!fs.existsSync(backupDir)) {
    console.log('❌ 未找到备份目录');
    return;
  }

  ENV_FILES.forEach(file => {
    const backupPath = path.join(backupDir, file);
    const originalPath = path.join(process.cwd(), file);
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, originalPath);
      console.log(`✅ 恢复 ${file}`);
    }
  });

  console.log('🔄 环境文件已从备份恢复');
  saveChecksums();
}

/**
 * 创建环境文件备份
 */
function createBackups() {
  const backupDir = path.join(process.cwd(), '.env-backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  ENV_FILES.forEach(file => {
    const originalPath = path.join(process.cwd(), file);
    const backupPath = path.join(backupDir, file);
    
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
      console.log(`📦 备份 ${file}`);
    }
  });

  console.log('✅ 环境文件备份完成');
}

// 主函数
function main() {
  const command = process.argv[2];

  switch (command) {
    case 'save':
    case 'save-checksums':
      saveChecksums();
      break;
    case 'verify':
    case 'check':
      verifyChecksums();
      break;
    case 'backup':
      createBackups();
      break;
    case 'restore':
      restoreBackups();
      break;
    case 'init':
      console.log('🔧 初始化环境保护...');
      createBackups();
      saveChecksums();
      console.log('✅ 环境保护初始化完成');
      break;
    default:
      console.log(`
🔒 环境变量保护工具

用法:
  node scripts/protect-env.js <command>

命令:
  init              初始化环境保护（备份+校验和）
  save              保存当前环境文件校验和
  verify            验证环境文件完整性
  backup            创建环境文件备份
  restore           从备份恢复环境文件

示例:
  npm run env:protect:init      # 初始化保护
  npm run env:protect:verify    # 检查完整性
  npm run env:protect:restore   # 恢复备份
`);
      break;
  }
}

main();