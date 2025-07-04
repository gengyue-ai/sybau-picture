const fs = require('fs');
const path = require('path');

// 需要修复的悬停效果模式
const hoverPatterns = [
  { pattern: /hover:bg-gray-100/g, replacement: '' },
  { pattern: /hover:shadow-xl/g, replacement: '' },
  { pattern: /hover:scale-105/g, replacement: '' },
  { pattern: /hover:-translate-y-1/g, replacement: '' },
  { pattern: /hover:-translate-y-2/g, replacement: '' },
  { pattern: /hover:bg-white\/20/g, replacement: '' },
  { pattern: /hover:bg-white\/30/g, replacement: '' },
  { pattern: /hover:border-purple-300/g, replacement: '' },
  { pattern: /hover:text-primary/g, replacement: '' },
  { pattern: /group-hover:scale-105/g, replacement: '' },
  { pattern: /group-hover:shadow-xl/g, replacement: '' },
  { pattern: /group-hover:-translate-y-1/g, replacement: '' },
  { pattern: /group-hover:translate-y-0/g, replacement: '' },
  { pattern: /group-hover:opacity-100/g, replacement: '' },
  { pattern: /transform hover:scale-105/g, replacement: '' },
  { pattern: /shadow-lg hover:shadow-xl transform hover:scale-105/g, replacement: 'shadow-lg' },
  { pattern: /hover:shadow-lg/g, replacement: '' },
  { pattern: /hover:text-purple-600/g, replacement: '' },
  { pattern: /hover:bg-white/g, replacement: '' }
];

// 递归遍历目录
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 跳过node_modules和.next目录
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        processDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(filePath);
    }
  });
}

// 处理单个文件
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 应用所有悬停效果的修复
    hoverPatterns.forEach(({ pattern, replacement }) => {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      if (content !== originalContent) {
        modified = true;
      }
    });

    // 清理多余的空格
    content = content.replace(/className="([^"]*?)(\s+)(\s+)([^"]*?)"/g, (match, p1, p2, p3, p4) => {
      return `className="${p1.trim().replace(/\s+/g, ' ')} ${p4.trim().replace(/\s+/g, ' ')}"`.replace(/\s+/g, ' ');
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`已修复悬停效果: ${filePath}`);
    }
  } catch (error) {
    console.error(`处理文件时出错 ${filePath}:`, error);
  }
}

// 开始处理
console.log('开始批量去除悬停效果...');
processDirectory('./app');
processDirectory('./components');
console.log('悬停效果修复完成！');
