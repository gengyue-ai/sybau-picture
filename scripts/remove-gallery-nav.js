const fs = require('fs');
const path = require('path');

// 需要处理的生成器页面文件
const generatorFiles = [
  'app/de/generator/page.tsx',
  'app/fr/generator/page.tsx',
  'app/pt/generator/page.tsx',
  'app/ru/generator/page.tsx',
  'app/ar/generator/page.tsx'
];

function removeGalleryNavigation() {
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

      // 删除Gallery按钮的各种模式
      const patterns = [
        // 德文版本模式
        {
          pattern: /\s*<div className="flex items-center space-x-4">\s*<Link href="\/de\/gallery">\s*<Button variant="outline">Galerie Ansehen<\/Button>\s*<\/Link>\s*<Link href="\/de\/about">\s*<Button variant="outline">Über Uns<\/Button>\s*<\/Link>\s*<\/div>/g,
          replacement: '<div></div>'
        },
        // 法文版本模式
        {
          pattern: /\s*<div className="flex items-center space-x-2">\s*<Badge variant="secondary" className="bg-purple-100 text-purple-700">\s*<Sparkles className="w-3 h-3 mr-1" \/>\s*Générateur IA\s*<\/Badge>\s*<Link href="\/fr\/gallery">\s*<Button variant="outline" size="sm">\s*Galerie\s*<\/Button>\s*<\/Link>\s*<\/div>/g,
          replacement: '<div></div>'
        },
        // 通用Gallery链接模式
        {
          pattern: /<Link href="\/[a-z]{2}\/gallery">\s*<Button[^>]*>.*?<\/Button>\s*<\/Link>/g,
          replacement: ''
        },
        // 单独的Gallery按钮
        {
          pattern: /<Button[^>]*>\s*(?:Gallery|Galerie|Galería|Галерея|معرض)\s*<\/Button>/g,
          replacement: ''
        }
      ];

      patterns.forEach(({ pattern, replacement }) => {
        const matches = content.match(pattern);
        if (matches) {
          content = content.replace(pattern, replacement);
          changes += matches.length;
        }
      });

      // 如果有变化，写入文件
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已处理: ${filePath} (${changes} 个变化)`);
        totalChanges += changes;
      } else {
        console.log(`ℹ️  无需更改: ${filePath}`);
      }

      filesProcessed++;
    } catch (error) {
      console.error(`❌ 处理文件时出错 ${filePath}:`, error.message);
    }
  });

  console.log(`\n📊 处理完成:`);
  console.log(`   - 处理的文件: ${filesProcessed}/${generatorFiles.length}`);
  console.log(`   - 总变化数: ${totalChanges}`);
}

// 运行脚本
console.log('🚀 开始删除重复的Gallery导航按钮...\n');
removeGalleryNavigation();
console.log('\n✨ 删除完成!');
