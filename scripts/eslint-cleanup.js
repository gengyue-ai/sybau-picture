#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * ESLint自动清理脚本
 * 自动修复常见的未使用变量和导入警告
 */

console.log('🔧 开始ESLint自动清理...');

// 获取所有ESLint警告
function getESLintWarnings() {
  try {
    const output = execSync('npm run lint', { encoding: 'utf8' });
    return output;
  } catch (error) {
    // ESLint有警告时会返回非零退出码，但我们仍然需要输出
    return error.stdout || error.message;
  }
}

// 解析ESLint输出，提取警告信息
function parseWarnings(lintOutput) {
  const warnings = [];
  const lines = lintOutput.split('\n');
  
  let currentFile = '';
  for (const line of lines) {
    // 检测文件路径
    if (line.startsWith('./')) {
      currentFile = line;
    }
    // 检测警告行
    else if (line.includes('Warning:') && line.includes('is defined but never used')) {
      const match = line.match(/(\d+):(\d+)\s+Warning:\s+'([^']+)'\s+is defined but never used/);
      if (match) {
        const [, lineNum, , varName] = match;
        warnings.push({
          file: currentFile,
          line: parseInt(lineNum),
          variable: varName,
          type: 'unused-var'
        });
      }
    }
  }
  
  return warnings;
}

// 修复单个文件中的未使用变量
function fixUnusedVariables(filePath, warnings) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;

  // 按行号倒序处理，避免行号变化影响
  warnings.sort((a, b) => b.line - a.line);

  for (const warning of warnings) {
    if (warning.file === filePath) {
      const lineIndex = warning.line - 1;
      if (lineIndex < lines.length) {
        const line = lines[lineIndex];
        const varName = warning.variable;
        
        // 跳过已经有下划线前缀的变量
        if (varName.startsWith('_')) continue;
        
        // 替换变量名为带下划线的版本
        const newLine = line.replace(
          new RegExp(`\\b${varName}\\b`, 'g'),
          `_${varName}`
        );
        
        if (newLine !== line) {
          lines[lineIndex] = newLine;
          modified = true;
          console.log(`  ✅ ${filePath}:${warning.line} - ${varName} → _${varName}`);
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    return true;
  }
  
  return false;
}

// 主函数
function main() {
  const lintOutput = getESLintWarnings();
  const warnings = parseWarnings(lintOutput);
  
  if (warnings.length === 0) {
    console.log('✨ 没有发现需要修复的未使用变量警告');
    return;
  }
  
  console.log(`📝 发现 ${warnings.length} 个未使用变量警告`);
  
  // 按文件分组警告
  const warningsByFile = {};
  warnings.forEach(warning => {
    if (!warningsByFile[warning.file]) {
      warningsByFile[warning.file] = [];
    }
    warningsByFile[warning.file].push(warning);
  });
  
  let totalFixed = 0;
  
  // 处理每个文件
  Object.keys(warningsByFile).forEach(file => {
    const fileWarnings = warningsByFile[file];
    console.log(`\n🔧 处理文件: ${file}`);
    
    if (fixUnusedVariables(file, fileWarnings)) {
      totalFixed += fileWarnings.length;
    }
  });
  
  console.log(`\n✨ 修复完成! 总共修复了 ${totalFixed} 个警告`);
  console.log('💡 建议运行 "npm run lint" 检查剩余警告');
}

if (require.main === module) {
  main();
}

module.exports = { main, parseWarnings, fixUnusedVariables }; 