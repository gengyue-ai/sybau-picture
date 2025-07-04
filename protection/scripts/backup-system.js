const fs = require('fs');
const path = require('path');
const { PROTECTED_FILES } = require('./file-integrity-check');

// 备份配置
const BACKUP_CONFIG = {
  maxBackups: 10, // 最大备份数量
  backupInterval: 24 * 60 * 60 * 1000, // 24小时
  compressionEnabled: false // 可选：启用压缩
};

// 创建备份目录
function ensureBackupDirectory() {
  const backupDir = 'protection/backups';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

// 生成备份文件名
function generateBackupFileName(originalFile, timestamp = null) {
  const ts = timestamp || new Date().toISOString().replace(/[:.]/g, '-');
  const ext = path.extname(originalFile);
  const name = path.basename(originalFile, ext);
  const dir = path.dirname(originalFile).replace(/[\\\/]/g, '_');
  return `${ts}_${dir}_${name}${ext}`;
}

// 备份单个文件
function backupFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ 文件不存在，跳过备份: ${filePath}`);
      return false;
    }
    
    const backupDir = ensureBackupDirectory();
    const backupFileName = generateBackupFileName(filePath);
    const backupPath = path.join(backupDir, backupFileName);
    
    // 复制文件
    fs.copyFileSync(filePath, backupPath);
    
    // 记录备份信息
    const backupInfo = {
      originalFile: filePath,
      backupFile: backupPath,
      timestamp: new Date().toISOString(),
      size: fs.statSync(filePath).size,
      hash: require('crypto').createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
    };
    
    // 保存备份元数据
    const metaPath = backupPath + '.meta.json';
    fs.writeFileSync(metaPath, JSON.stringify(backupInfo, null, 2));
    
    console.log(`✅ 备份成功: ${filePath} → ${backupFileName}`);
    return backupInfo;
  } catch (error) {
    console.error(`❌ 备份失败 ${filePath}:`, error.message);
    return false;
  }
}

// 备份所有受保护的文件
function backupProtectedFiles() {
  console.log('🔄 开始备份受保护的文件...');
  const backupResults = [];
  
  PROTECTED_FILES.forEach(file => {
    const result = backupFile(file);
    if (result) {
      backupResults.push(result);
    }
  });
  
  // 保存备份批次信息
  const batchInfo = {
    timestamp: new Date().toISOString(),
    totalFiles: PROTECTED_FILES.length,
    successfulBackups: backupResults.length,
    backups: backupResults
  };
  
  const batchPath = path.join('protection/backups', `backup-batch-${Date.now()}.json`);
  fs.writeFileSync(batchPath, JSON.stringify(batchInfo, null, 2));
  
  console.log(`📦 备份完成: ${backupResults.length}/${PROTECTED_FILES.length} 文件`);
  console.log(`📝 批次信息保存到: ${batchPath}`);
  
  return batchInfo;
}

// 清理旧备份
function cleanupOldBackups() {
  const backupDir = 'protection/backups';
  if (!fs.existsSync(backupDir)) {
    return;
  }
  
  console.log('🧹 清理旧备份文件...');
  
  const files = fs.readdirSync(backupDir);
  const backupFiles = files.filter(f => !f.endsWith('.meta.json') && !f.startsWith('backup-batch-'));
  
  // 按时间排序（最新的在前）
  backupFiles.sort((a, b) => {
    const statA = fs.statSync(path.join(backupDir, a));
    const statB = fs.statSync(path.join(backupDir, b));
    return statB.mtime.getTime() - statA.mtime.getTime();
  });
  
  // 删除超出限制的备份
  if (backupFiles.length > BACKUP_CONFIG.maxBackups) {
    const filesToDelete = backupFiles.slice(BACKUP_CONFIG.maxBackups);
    
    filesToDelete.forEach(file => {
      const filePath = path.join(backupDir, file);
      const metaPath = filePath + '.meta.json';
      
      try {
        fs.unlinkSync(filePath);
        if (fs.existsSync(metaPath)) {
          fs.unlinkSync(metaPath);
        }
        console.log(`🗑️ 删除旧备份: ${file}`);
      } catch (error) {
        console.error(`❌ 删除失败 ${file}:`, error.message);
      }
    });
  }
}

// 恢复文件
function restoreFile(originalFile, backupTimestamp = null) {
  const backupDir = 'protection/backups';
  
  if (!fs.existsSync(backupDir)) {
    console.error('❌ 备份目录不存在');
    return false;
  }
  
  const files = fs.readdirSync(backupDir);
  let targetBackup = null;
  
  if (backupTimestamp) {
    // 查找指定时间戳的备份
    const targetFileName = generateBackupFileName(originalFile, backupTimestamp);
    targetBackup = files.find(f => f === targetFileName);
  } else {
    // 查找最新的备份
    const fileBackups = files.filter(f => {
      return f.includes(path.basename(originalFile, path.extname(originalFile))) &&
             f.includes(path.dirname(originalFile).replace(/[\\\/]/g, '_'));
    }).sort().reverse();
    
    targetBackup = fileBackups[0];
  }
  
  if (!targetBackup) {
    console.error(`❌ 未找到 ${originalFile} 的备份文件`);
    return false;
  }
  
  try {
    const backupPath = path.join(backupDir, targetBackup);
    const metaPath = backupPath + '.meta.json';
    
    // 验证备份完整性
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const currentHash = require('crypto').createHash('sha256').update(fs.readFileSync(backupPath)).digest('hex');
      
      if (currentHash !== meta.hash) {
        console.error(`❌ 备份文件已损坏: ${targetBackup}`);
        return false;
      }
    }
    
    // 创建目标目录
    const targetDir = path.dirname(originalFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 恢复文件
    fs.copyFileSync(backupPath, originalFile);
    console.log(`✅ 恢复成功: ${targetBackup} → ${originalFile}`);
    
    return true;
  } catch (error) {
    console.error(`❌ 恢复失败:`, error.message);
    return false;
  }
}

// 列出可用的备份
function listBackups(originalFile = null) {
  const backupDir = 'protection/backups';
  
  if (!fs.existsSync(backupDir)) {
    console.log('📂 没有找到备份目录');
    return [];
  }
  
  const files = fs.readdirSync(backupDir);
  let backupFiles = files.filter(f => !f.endsWith('.meta.json') && !f.startsWith('backup-batch-'));
  
  if (originalFile) {
    backupFiles = backupFiles.filter(f => {
      return f.includes(path.basename(originalFile, path.extname(originalFile))) &&
             f.includes(path.dirname(originalFile).replace(/[\\\/]/g, '_'));
    });
  }
  
  const backupList = backupFiles.map(file => {
    const filePath = path.join(backupDir, file);
    const metaPath = filePath + '.meta.json';
    
    let meta = null;
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      } catch (error) {
        // 忽略损坏的元数据
      }
    }
    
    const stat = fs.statSync(filePath);
    return {
      backupFile: file,
      originalFile: meta ? meta.originalFile : '未知',
      timestamp: meta ? meta.timestamp : stat.ctime.toISOString(),
      size: stat.size,
      path: filePath
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return backupList;
}

// 主执行逻辑
if (require.main === module) {
  const command = process.argv[2];
  const target = process.argv[3];
  
  switch (command) {
    case 'backup':
      if (target) {
        backupFile(target);
      } else {
        backupProtectedFiles();
      }
      break;
    case 'restore':
      if (!target) {
        console.error('❌ 请指定要恢复的文件路径');
        process.exit(1);
      }
      const timestamp = process.argv[4];
      restoreFile(target, timestamp);
      break;
    case 'list':
      const backups = listBackups(target);
      if (backups.length === 0) {
        console.log('📂 没有找到备份文件');
      } else {
        console.log('📋 可用备份:');
        backups.forEach((backup, index) => {
          console.log(`${index + 1}. ${backup.backupFile}`);
          console.log(`   原文件: ${backup.originalFile}`);
          console.log(`   时间: ${backup.timestamp}`);
          console.log(`   大小: ${backup.size} bytes`);
          console.log('');
        });
      }
      break;
    case 'cleanup':
      cleanupOldBackups();
      break;
    default:
      console.log('用法:');
      console.log('  node backup-system.js backup [文件路径]    - 备份文件（不指定文件则备份所有保护文件）');
      console.log('  node backup-system.js restore <文件路径> [时间戳]  - 恢复文件');
      console.log('  node backup-system.js list [文件路径]      - 列出备份文件');
      console.log('  node backup-system.js cleanup             - 清理旧备份');
  }
}

module.exports = {
  backupFile,
  backupProtectedFiles,
  restoreFile,
  listBackups,
  cleanupOldBackups
}; 