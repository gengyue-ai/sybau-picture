const fs = require('fs');
const path = require('path');

// 创建目录如果不存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成SVG占位符图片
function generateSVGPlaceholder(title, color = '#6366f1', width = 800, height = 400) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${color}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${title}</text>
</svg>`;
}

// 生成作者头像SVG
function generateAuthorAvatar(name, color = '#8b5cf6', size = 150) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial, sans-serif" font-size="36" font-weight="bold">${initials}</text>
</svg>`;
}

// 文章图片列表
const articleImages = [
  { filename: 'ai-image-generation-guide.svg', title: 'AI Image Generation Guide', color: '#6366f1' },
  { filename: 'viral-content-strategy.svg', title: 'Viral Content Strategy', color: '#ec4899' },
  { filename: 'ai-ethics-copyright.svg', title: 'AI Ethics & Copyright', color: '#10b981' },
  { filename: 'prompt-engineering-guide.svg', title: 'Prompt Engineering Guide', color: '#f59e0b' },
  { filename: 'ai-art-business.svg', title: 'AI Art Business', color: '#8b5cf6' },

  // 中文文章图片
  { filename: 'ai-image-generation-guide-zh.svg', title: 'AI图像生成指南', color: '#6366f1' },
  { filename: 'viral-content-strategy-zh.svg', title: '病毒式内容策略', color: '#ec4899' },
  { filename: 'ai-ethics-copyright-zh.svg', title: 'AI伦理与版权', color: '#10b981' },

  // 其他语言文章图片
  { filename: 'ai-image-generation-guide-es.svg', title: 'Guía de Generación IA', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-ja.svg', title: 'AI画像生成ガイド', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-ko.svg', title: 'AI 이미지 생성 가이드', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-fr.svg', title: 'Guide Génération IA', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-de.svg', title: 'KI-Bildgenerierung', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-pt.svg', title: 'Guia Geração IA', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-ru.svg', title: 'Руководство ИИ', color: '#6366f1' },
  { filename: 'ai-image-generation-guide-ar.svg', title: 'دليل توليد الصور', color: '#6366f1' }
];

// 作者头像列表
const authorAvatars = [
  { filename: 'alex-thompson.svg', name: 'Alex Thompson', color: '#6366f1' },
  { filename: 'maria-rodriguez.svg', name: 'Maria Rodriguez', color: '#ec4899' },
  { filename: 'jennifer-walsh.svg', name: 'Jennifer Walsh', color: '#10b981' },
  { filename: 'david-kim.svg', name: 'David Kim', color: '#f59e0b' },
  { filename: 'sarah-chen.svg', name: 'Sarah Chen', color: '#8b5cf6' },

  // 中文作者
  { filename: 'chen-zhiming.svg', name: '陈志明', color: '#6366f1' },
  { filename: 'wang-meili.svg', name: '王美丽', color: '#ec4899' },
  { filename: 'liu-doctor.svg', name: '刘博士', color: '#10b981' },

  // 其他语言作者
  { filename: 'carlos-garcia.svg', name: 'Carlos Garcia', color: '#f59e0b' },
  { filename: 'tanaka-taro.svg', name: '田中太郎', color: '#8b5cf6' },
  { filename: 'kim-minsu.svg', name: '김민수', color: '#6366f1' },
  { filename: 'marie-dubois.svg', name: 'Marie Dubois', color: '#ec4899' },
  { filename: 'hans-mueller.svg', name: 'Hans Mueller', color: '#10b981' },
  { filename: 'ana-silva.svg', name: 'Ana Silva', color: '#f59e0b' },
  { filename: 'ivan-petrov.svg', name: 'Иван Петров', color: '#8b5cf6' },
  { filename: 'ahmed-mohamed.svg', name: 'أحمد محمد', color: '#6366f1' }
];

// 创建目录
const articlesDir = path.join(__dirname, '../public/images/blog/articles');
const authorsDir = path.join(__dirname, '../public/images/blog/authors');

ensureDirectoryExists(articlesDir);
ensureDirectoryExists(authorsDir);

// 生成文章图片
articleImages.forEach(({ filename, title, color }) => {
  const filePath = path.join(articlesDir, filename);
  const svgContent = generateSVGPlaceholder(title, color);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created article image: ${filename}`);
});

// 生成作者头像
authorAvatars.forEach(({ filename, name, color }) => {
  const filePath = path.join(authorsDir, filename);
  const svgContent = generateAuthorAvatar(name, color);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created author avatar: ${filename}`);
});

console.log('All local SVG images generated successfully!');
