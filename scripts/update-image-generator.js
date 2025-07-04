const fs = require('fs');
const path = require('path');

// 需要更新的生成器页面文件
const generatorFiles = [
  'app/fr/generator/page.tsx',
  'app/es/generator/page.tsx',
  'app/ja/generator/page.tsx',
  'app/ko/generator/page.tsx'
];

function updateImageGeneratorImport() {
  let filesProcessed = 0;
  let totalChanges = 0;

  generatorFiles.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${filePath}`);
      return;
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      let changes = 0;

      // 替换import语句
      if (content.includes('import ImageGenerator from')) {
        content = content.replace(
          /import ImageGenerator from '@\/components\/ImageGenerator'/g,
          "import ImageGeneratorFixed from '@/components/ImageGeneratorFixed'"
        );
        changes++;
      }

      // 替换组件使用
      if (content.includes('<ImageGenerator')) {
        content = content.replace(
          /<ImageGenerator(\s)/g,
          '<ImageGeneratorFixed$1'
        );
        changes++;
      }

      // 如果有变化，写入文件
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已更新: ${filePath} (${changes} 个变化)`);
        totalChanges += changes;
      } else {
        console.log(`ℹ️  无需更改: ${filePath}`);
      }

      filesProcessed++;
    } catch (error) {
      console.error(`❌ 处理文件时出错 ${filePath}:`, error.message);
    }
  });

  console.log(`\n📊 更新完成:`);
  console.log(`   - 处理的文件: ${filesProcessed}/${generatorFiles.length}`);
  console.log(`   - 总变化数: ${totalChanges}`);
}

// 运行脚本
console.log('🚀 开始更新ImageGenerator组件...\n');
updateImageGeneratorImport();
console.log('\n✨ 更新完成!');
