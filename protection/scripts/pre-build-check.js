const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { verifyIntegrity, isFileCorrupted } = require('./file-integrity-check');
const { backupProtectedFiles } = require('./backup-system');

// 验证配置
const VALIDATION_CONFIG = {
  checkSyntax: true,
  checkImports: true,
  checkExports: true,
  checkComponents: true,
  runTypeCheck: true,
  runLinting: false, // 可选：运行 ESLint
  requireBackup: true
};

// 语法检查函数
function checkSyntax(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // 检查未完成的导入语句
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // 检查导入语句
      if (trimmed.startsWith('import') && !trimmed.includes('from') && !trimmed.startsWith('import(')) {
        if (!trimmed.endsWith(';') || trimmed.split('{').length !== trimmed.split('}').length) {
          issues.push({
            type: 'SYNTAX_ERROR',
            line: index + 1,
            message: '不完整的导入语句',
            content: trimmed
          });
        }
      }
      
      // 检查未闭合的大括号
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      if (openBraces !== closeBraces && trimmed !== '' && !trimmed.startsWith('//')) {
        // 简单检查，可能存在误报
      }
    });
    
    // 检查基本的 React 组件结构
    if (filePath.endsWith('.tsx') && filePath.includes('page.tsx')) {
      if (!content.includes('export default')) {
        issues.push({
          type: 'COMPONENT_ERROR',
          message: '缺少默认导出'
        });
      }
      
      if (!content.includes('function') && !content.includes('=>')) {
        issues.push({
          type: 'COMPONENT_ERROR',
          message: '缺少函数定义'
        });
      }
      
      if (!content.includes('return')) {
        issues.push({
          type: 'COMPONENT_ERROR',
          message: '缺少 return 语句'
        });
      }
    }
    
  } catch (error) {
    issues.push({
      type: 'READ_ERROR',
      message: `无法读取文件: ${error.message}`
    });
  }
  
  return issues;
}

// 检查导入依赖
function checkImports(filePath) {
  const issues = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // 检查相对路径导入
      if (importPath.startsWith('.')) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);
        const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx'];
        
        let exists = false;
        for (const ext of possibleExtensions) {
          if (fs.existsSync(resolvedPath + ext)) {
            exists = true;
            break;
          }
        }
        
        if (!exists && !fs.existsSync(resolvedPath)) {
          issues.push({
            type: 'IMPORT_ERROR',
            message: `找不到导入文件: ${importPath}`,
            importPath
          });
        }
      }
    }
  } catch (error) {
    issues.push({
      type: 'READ_ERROR',
      message: `无法读取文件: ${error.message}`
    });
  }
  
  return issues;
}

// TypeScript 类型检查
function runTypeCheck() {
  console.log('🔍 运行 TypeScript 类型检查...');
  
  try {
    const output = execSync('npx tsc --noEmit', { 
      encoding: 'utf8',
      timeout: 60000,
      stdio: 'pipe'
    });
    
    console.log('✅ TypeScript 类型检查通过');
    return { success: true, output };
  } catch (error) {
    console.log('❌ TypeScript 类型检查失败');
    return { 
      success: false, 
      output: error.stdout || error.stderr || error.message 
    };
  }
}

// 验证 package.json 依赖
function checkDependencies() {
  console.log('📦 检查依赖完整性...');
  
  try {
    if (!fs.existsSync('node_modules')) {
      return {
        success: false,
        message: 'node_modules 目录不存在，请运行 npm install'
      };
    }
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const missingDeps = [];
    
    // 检查生产依赖
    if (packageJson.dependencies) {
      Object.keys(packageJson.dependencies).forEach(dep => {
        if (!fs.existsSync(path.join('node_modules', dep))) {
          missingDeps.push(dep);
        }
      });
    }
    
    if (missingDeps.length > 0) {
      return {
        success: false,
        message: `缺少依赖: ${missingDeps.join(', ')}`
      };
    }
    
    console.log('✅ 依赖检查通过');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: `依赖检查失败: ${error.message}`
    };
  }
}

// 主验证函数
function runPreBuildCheck() {
  console.log('🚀 开始构建前检查...');
  console.log('='.repeat(50));
  
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    success: true,
    checks: {},
    issues: []
  };
  
  // 1. 文件完整性检查
  console.log('\n1️⃣ 文件完整性检查');
  const integrityResult = verifyIntegrity();
  results.checks.integrity = integrityResult;
  
  if (!integrityResult.success) {
    results.success = false;
    console.log('❌ 文件完整性检查失败');
    integrityResult.issues.forEach(issue => {
      results.issues.push(`完整性: ${issue.file} - ${issue.message}`);
    });
  } else {
    console.log('✅ 文件完整性检查通过');
  }
  
  // 2. 备份检查（如果启用）
  if (VALIDATION_CONFIG.requireBackup) {
    console.log('\n2️⃣ 检查备份状态');
    const { listBackups } = require('./backup-system');
    const recentBackups = listBackups().filter(backup => {
      const backupTime = new Date(backup.timestamp);
      const hoursDiff = (Date.now() - backupTime.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24; // 24小时内的备份
    });
    
    if (recentBackups.length === 0) {
      console.log('⚠️ 没有找到最近的备份，正在创建备份...');
      backupProtectedFiles();
    } else {
      console.log(`✅ 找到 ${recentBackups.length} 个最近的备份`);
    }
  }
  
  // 3. 语法检查
  if (VALIDATION_CONFIG.checkSyntax) {
    console.log('\n3️⃣ 语法检查');
    const { PROTECTED_FILES } = require('./file-integrity-check');
    let syntaxIssues = 0;
    
    PROTECTED_FILES.forEach(file => {
      if (fs.existsSync(file)) {
        const fileIssues = checkSyntax(file);
        if (fileIssues.length > 0) {
          syntaxIssues += fileIssues.length;
          console.log(`❌ ${file}:`);
          fileIssues.forEach(issue => {
            console.log(`   ${issue.type}: ${issue.message}`);
            results.issues.push(`语法: ${file} - ${issue.message}`);
          });
          results.success = false;
        }
      }
    });
    
    if (syntaxIssues === 0) {
      console.log('✅ 语法检查通过');
    } else {
      console.log(`❌ 发现 ${syntaxIssues} 个语法问题`);
    }
  }
  
  // 4. TypeScript 类型检查
  if (VALIDATION_CONFIG.runTypeCheck) {
    console.log('\n4️⃣ TypeScript 类型检查');
    const typeCheckResult = runTypeCheck();
    results.checks.typeCheck = typeCheckResult;
    
    if (!typeCheckResult.success) {
      results.success = false;
      console.log('类型检查输出:');
      console.log(typeCheckResult.output);
      results.issues.push('TypeScript 类型检查失败');
    }
  }
  
  // 5. 依赖检查
  console.log('\n5️⃣ 依赖检查');
  const depResult = checkDependencies();
  results.checks.dependencies = depResult;
  
  if (!depResult.success) {
    results.success = false;
    console.log(`❌ ${depResult.message}`);
    results.issues.push(`依赖: ${depResult.message}`);
  }
  
  // 总结
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n' + '='.repeat(50));
  console.log(`⏱️ 检查完成，耗时: ${duration}s`);
  
  if (results.success) {
    console.log('🎉 所有检查通过，可以安全构建！');
  } else {
    console.log('❌ 发现问题，请修复后再构建：');
    results.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
  }
  
  // 保存检查结果
  const reportPath = `protection/logs/pre-build-check-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📝 检查报告已保存: ${reportPath}`);
  
  return results;
}

// 主执行逻辑
if (require.main === module) {
  const result = runPreBuildCheck();
  process.exit(result.success ? 0 : 1);
}

module.exports = {
  runPreBuildCheck,
  checkSyntax,
  checkImports,
  runTypeCheck,
  checkDependencies,
  VALIDATION_CONFIG
}; 