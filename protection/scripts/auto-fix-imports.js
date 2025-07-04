const fs = require('fs');
const path = require('path');

// 需要修复的文件模式
const IMPORT_FIXES = [
  // 移除错误的下划线前缀导入
  { from: /import\s+{\s*([^}]*_[A-Za-z][^}]*)\s*}\s+from\s+['"]([^'"]+)['"];?/g, action: 'fix_underscore' },
  
  // 修复特定的错误导入
  { from: /_CardDescription/g, to: 'CardDescription' },
  { from: /_Check/g, to: 'Check' },
  { from: /_AlertCircle/g, to: 'AlertCircle' },
  { from: /_X/g, to: 'X' },
  { from: /_Sparkles/g, to: 'Sparkles' },
  { from: /_Clock/g, to: 'Clock' },
  { from: /_Badge/g, to: 'Badge' },
  { from: /_RefreshCw/g, to: 'RefreshCw' },
  { from: /_Separator/g, to: 'Separator' },
  { from: /_TrendingUp/g, to: 'TrendingUp' },
  { from: /_Globe2/g, to: 'Globe2' },
  { from: /_Lock/g, to: 'Lock' },
  { from: /_Coffee/g, to: 'Coffee' },
  { from: /_MessageCircle/g, to: 'MessageCircle' },
  { from: /_Github/g, to: 'Github' },
  { from: /_Twitter/g, to: 'Twitter' },
  { from: /_Mail/g, to: 'Mail' },
  { from: /_CheckCircle/g, to: 'CheckCircle' },
  { from: /_BarChart3/g, to: 'BarChart3' },
  { from: /_UserCheck/g, to: 'UserCheck' },
  { from: /_MapPin/g, to: 'MapPin' },
  { from: /_Heart/g, to: 'Heart' },
  { from: /_Share2/g, to: 'Share2' },
  { from: /_Calendar/g, to: 'Calendar' },
  { from: /_User/g, to: 'User' },
  { from: /_FileText/g, to: 'FileText' },
  { from: /_Zap/g, to: 'Zap' },
  { from: /_Trophy/g, to: 'Trophy' },
  { from: /_ArrowRight/g, to: 'ArrowRight' },
  { from: /_DropdownMenu/g, to: 'DropdownMenu' },
  { from: /_DropdownMenuContent/g, to: 'DropdownMenuContent' },
  { from: /_DropdownMenuItem/g, to: 'DropdownMenuItem' },
  { from: /_DropdownMenuTrigger/g, to: 'DropdownMenuTrigger' },
  { from: /_Home/g, to: 'Home' },
  { from: /_ChevronDown/g, to: 'ChevronDown' },
  { from: /_Filter/g, to: 'Filter' },
  { from: /_cn/g, to: 'cn' },
  
  // 修复属性名错误
  { from: /\._user/g, to: '.user' },
  { from: /\._account/g, to: '.account' },
  { from: /\._profile/g, to: '.profile' }
];

// 需要修复的文件列表
const FILES_TO_FIX = [
  'app/gallery/page.tsx',
  'app/generator/page.tsx',
  'app/blog/page.tsx',
  'app/about/page.tsx',
  'app/help/page.tsx',
  'app/history/page.tsx',
  'app/support/page.tsx',
  'app/ja/about/page.tsx',
  'app/ja/blog/[slug]/page.tsx',
  'app/zh/about/page.tsx',
  'app/zh/blog/[slug]/page.tsx',
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'lib/auth.ts'
];

// 修复导入语句中的下划线前缀
function fixUnderscoreImports(content) {
  return content.replace(
    /import\s+{\s*([^}]*)\s*}\s+from\s+(['"][^'"]+['"])/g,
    (match, imports, source) => {
      // 分割导入项并移除下划线前缀
      const fixedImports = imports
        .split(',')
        .map(item => item.trim())
        .map(item => {
          // 移除前导下划线
          if (item.startsWith('_')) {
            return item.substring(1);
          }
          return item;
        })
        .join(', ');
      
      return `import { ${fixedImports} } from ${source}`;
    }
  );
}

// 修复文件中的所有问题
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 文件不存在: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 应用所有修复规则
    IMPORT_FIXES.forEach(fix => {
      if (fix.action === 'fix_underscore') {
        const newContent = fixUnderscoreImports(content);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      } else if (fix.to) {
        const newContent = content.replace(fix.from, fix.to);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });
    
    // 修复特殊情况：gallery page.tsx 中的 Date 问题
    if (filePath.includes('gallery/page.tsx')) {
      // 修复 Date 对象传递给字符串参数的问题
      content = content.replace(
        /formatDate\(new Date\(([^)]+)\)\)/g,
        'formatDate($1)'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已修复: ${filePath}`);
      return true;
    } else {
      console.log(`✓ 无需修复: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 修复失败 ${filePath}:`, error.message);
    return false;
  }
}

// 批量修复所有文件
function fixAllFiles() {
  console.log('🔧 开始自动修复导入错误...');
  
  let totalFixed = 0;
  let totalProcessed = 0;
  
  FILES_TO_FIX.forEach(file => {
    totalProcessed++;
    if (fixFile(file)) {
      totalFixed++;
    }
  });
  
  console.log(`\n📊 修复完成: ${totalFixed}/${totalProcessed} 文件已修复`);
  return { totalFixed, totalProcessed };
}

// 验证修复结果
function validateFixes() {
  console.log('🔍 验证修复结果...');
  
  const issues = [];
  
  FILES_TO_FIX.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // 检查是否还有下划线前缀的导入
      const underscoreImports = content.match(/_[A-Z][a-zA-Z]*/g);
      if (underscoreImports) {
        issues.push({
          file,
          type: 'underscore_imports',
          items: underscoreImports
        });
      }
      
      // 检查是否有不完整的导入语句
      const incompleteImports = content.match(/import\s+{[^}]*$/gm);
      if (incompleteImports) {
        issues.push({
          file,
          type: 'incomplete_imports',
          items: incompleteImports
        });
      }
    } catch (error) {
      issues.push({
        file,
        type: 'read_error',
        error: error.message
      });
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ 所有文件修复验证通过！');
    return true;
  } else {
    console.log('⚠️ 发现以下问题:');
    issues.forEach(issue => {
      console.log(`- ${issue.file}: ${issue.type}`);
      if (issue.items) {
        console.log(`  问题项: ${issue.items.join(', ')}`);
      }
    });
    return false;
  }
}

// 主执行逻辑
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'fix':
      const target = process.argv[3];
      if (target) {
        fixFile(target);
      } else {
        fixAllFiles();
      }
      break;
    case 'validate':
      validateFixes();
      break;
    case 'auto':
      fixAllFiles();
      validateFixes();
      break;
    default:
      console.log('用法:');
      console.log('  node auto-fix-imports.js fix [文件路径]  - 修复文件（不指定则修复所有）');
      console.log('  node auto-fix-imports.js validate       - 验证修复结果');
      console.log('  node auto-fix-imports.js auto           - 自动修复并验证');
  }
}

module.exports = {
  fixFile,
  fixAllFiles,
  validateFixes,
  FILES_TO_FIX,
  IMPORT_FIXES
}; 