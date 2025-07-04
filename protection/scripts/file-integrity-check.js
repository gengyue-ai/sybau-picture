const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// 重要文件列表 - 这些文件受到严格保护
const PROTECTED_FILES = [
  'app/page.tsx',
  'app/layout.tsx',
  'app/gallery/page.tsx',
  'app/generator/page.tsx',
  'app/blog/page.tsx',
  'app/about/page.tsx',
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'components/HomePageClient.tsx',
  'lib/i18n.ts',
  'lib/utils.ts',
  'lib/auth.ts',
  'middleware.ts',
  'next.config.js',
  'package.json',
  'prisma/schema.prisma'
];

// 生成文件哈希值
function generateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (error) {
    return null;
  }
}

// 检查文件是否为空或损坏
function isFileCorrupted(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    
    // 检查是否为空
    if (!content) {
      return { corrupted: true, reason: 'File is empty' };
    }
    
    // 检查React组件文件
    if (filePath.endsWith('.tsx') && filePath.includes('page.tsx')) {
      if (!content.includes('export default') || !content.includes('function')) {
        return { corrupted: true, reason: 'Missing default export or function' };
      }
    }
    
    // 检查JSON文件
    if (filePath.endsWith('.json')) {
      try {
        JSON.parse(content);
      } catch {
        return { corrupted: true, reason: 'Invalid JSON syntax' };
      }
    }
    
    // 检查TypeScript/JavaScript文件的基本语法
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
      // 检查是否有未完成的导入语句
      if (content.includes('import') && !content.includes('from')) {
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('import') && !line.includes('from') && !line.startsWith('import(')) {
            return { corrupted: true, reason: `Incomplete import statement at line ${i + 1}` };
          }
        }
      }
    }
    
    return { corrupted: false };
  } catch (error) {
    return { corrupted: true, reason: `Read error: ${error.message}` };
  }
}

// 保存文件校验和
function saveChecksums() {
  const checksums = {};
  const timestamp = new Date().toISOString();
  
  console.log('🔍 生成文件校验和...');
  
  PROTECTED_FILES.forEach(file => {
    const hash = generateFileHash(file);
    if (hash) {
      checksums[file] = {
        hash,
        timestamp,
        size: fs.statSync(file).size
      };
      console.log(`✅ ${file}: ${hash.substring(0, 8)}...`);
    } else {
      console.log(`❌ ${file}: 文件不存在或无法读取`);
    }
  });
  
  const checksumPath = 'protection/checksums/file-checksums.json';
  fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
  console.log(`💾 校验和已保存到: ${checksumPath}`);
  
  return checksums;
}

// 验证文件完整性
function verifyIntegrity() {
  console.log('🔍 开始文件完整性检查...');
  
  const checksumPath = 'protection/checksums/file-checksums.json';
  let savedChecksums = {};
  
  // 读取保存的校验和
  if (fs.existsSync(checksumPath)) {
    savedChecksums = JSON.parse(fs.readFileSync(checksumPath, 'utf8'));
  } else {
    console.log('⚠️ 未找到保存的校验和，将生成新的基准校验和');
    return saveChecksums();
  }
  
  const issues = [];
  
  PROTECTED_FILES.forEach(file => {
    console.log(`检查: ${file}`);
    
    // 检查文件是否存在
    if (!fs.existsSync(file)) {
      issues.push({
        file,
        type: 'MISSING',
        message: '文件不存在'
      });
      return;
    }
    
    // 检查文件是否损坏
    const corruptionCheck = isFileCorrupted(file);
    if (corruptionCheck.corrupted) {
      issues.push({
        file,
        type: 'CORRUPTED',
        message: corruptionCheck.reason
      });
      return;
    }
    
    // 检查文件哈希
    const currentHash = generateFileHash(file);
    const savedChecksum = savedChecksums[file];
    
    if (!savedChecksum) {
      issues.push({
        file,
        type: 'NEW',
        message: '新文件，未在基准校验和中'
      });
    } else if (currentHash !== savedChecksum.hash) {
      issues.push({
        file,
        type: 'MODIFIED',
        message: '文件已被修改',
        oldHash: savedChecksum.hash.substring(0, 8),
        newHash: currentHash.substring(0, 8)
      });
    } else {
      console.log(`✅ ${file}: 完整性正常`);
    }
  });
  
  // 输出检查结果
  if (issues.length === 0) {
    console.log('🎉 所有受保护文件的完整性检查通过！');
    return { success: true, issues: [] };
  } else {
    console.log('\n⚠️ 发现以下问题：');
    issues.forEach(issue => {
      console.log(`❌ ${issue.file}: ${issue.message}`);
      if (issue.oldHash && issue.newHash) {
        console.log(`   旧哈希: ${issue.oldHash}... → 新哈希: ${issue.newHash}...`);
      }
    });
    
    // 记录到日志文件
    const logData = {
      timestamp: new Date().toISOString(),
      issues
    };
    
    const logPath = `protection/logs/integrity-issues-${Date.now()}.json`;
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
    console.log(`📝 问题详情已记录到: ${logPath}`);
    
    return { success: false, issues };
  }
}

// 主执行逻辑
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'save':
      saveChecksums();
      break;
    case 'verify':
      const result = verifyIntegrity();
      process.exit(result.success ? 0 : 1);
      break;
    case 'report':
      const verification = verifyIntegrity();
      console.log('\n📊 完整性检查报告：');
      console.log(`总计检查文件: ${PROTECTED_FILES.length}`);
      console.log(`发现问题: ${verification.issues.length}`);
      if (verification.issues.length > 0) {
        verification.issues.forEach(issue => {
          console.log(`- ${issue.type}: ${issue.file}`);
        });
      }
      break;
    default:
      console.log('用法:');
      console.log('  node file-integrity-check.js save    - 保存当前文件校验和');
      console.log('  node file-integrity-check.js verify  - 验证文件完整性');
      console.log('  node file-integrity-check.js report  - 生成完整性报告');
  }
}

module.exports = {
  PROTECTED_FILES,
  generateFileHash,
  isFileCorrupted,
  saveChecksums,
  verifyIntegrity
}; 