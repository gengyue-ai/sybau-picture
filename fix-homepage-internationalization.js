const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'HomePageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('修复HomePageClient.tsx中的硬编码英文文本...');

// 修复步骤2和3的描述
content = content.replace(
  "description: 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.',",
  "description: getText('home.howitworks.step2.desc', 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.'),"
);

content = content.replace(
  "description: 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.',",
  "description: getText('home.howitworks.step3.desc', 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.'),"
);

// 修复功能特性的硬编码文本
content = content.replace(
  "title: 'Secure & Private',",
  "title: getText('home.features.secure.title', 'Secure & Private'),"
);

content = content.replace(
  "description: 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.',",
  "description: getText('home.features.secure.desc', 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.'),"
);

content = content.replace(
  "title: 'Global Community',",
  "title: getText('home.features.community.title', 'Global Community'),"
);

content = content.replace(
  "description: 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.',",
  "description: getText('home.features.community.desc', 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.'),"
);

content = content.replace(
  "title: '24/7 Available',",
  "title: getText('home.features.available.title', '24/7 Available'),"
);

content = content.replace(
  "description: 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.',",
  "description: getText('home.features.available.desc', 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.'),"
);

// 修复用例部分的好处列表
content = content.replace(
  "benefits: ['Brand engagement', 'Viral content', 'Time efficient']",
  "benefits: [getText('home.usecases.social.benefit1', 'Brand engagement'), getText('home.usecases.social.benefit2', 'Viral content'), getText('home.usecases.social.benefit3', 'Time efficient')]"
);

content = content.replace(
  "benefits: ['Audience growth', 'Unique style', 'Easy creation']",
  "benefits: [getText('home.usecases.content.benefit1', 'Audience growth'), getText('home.usecases.content.benefit2', 'Unique style'), getText('home.usecases.content.benefit3', 'Easy creation')]"
);

content = content.replace(
  "benefits: ['Higher CTR', 'Cost effective', 'Quick turnaround']",
  "benefits: [getText('home.usecases.marketing.benefit1', 'Higher CTR'), getText('home.usecases.marketing.benefit2', 'Cost effective'), getText('home.usecases.marketing.benefit3', 'Quick turnaround')]"
);

content = content.replace(
  "benefits: ['Personal fun', 'Social sharing', 'Creative expression']",
  "benefits: [getText('home.usecases.individuals.benefit1', 'Personal fun'), getText('home.usecases.individuals.benefit2', 'Social sharing'), getText('home.usecases.individuals.benefit3', 'Creative expression')]"
);

// 修复社区统计数据
content = content.replace(
  "<div className=\"text-gray-600\">{getText('home.community.stats.users', 'Active Users')}</div>",
  "<div className=\"text-gray-600\">{getText('home.community.stats.users.label', 'Active Users')}</div>"
);

content = content.replace(
  "<div className=\"text-gray-600\">{getText('home.community.stats.creations', 'Daily Creations')}</div>",
  "<div className=\"text-gray-600\">{getText('home.community.stats.creations.label', 'Daily Creations')}</div>"
);

content = content.replace(
  "<div className=\"text-gray-600\">{getText('home.community.stats.satisfaction', 'Satisfaction Rate')}</div>",
  "<div className=\"text-gray-600\">{getText('home.community.stats.satisfaction.label', 'Satisfaction Rate')}</div>"
);

// 修复页面底部的功能描述
content = content.replace(
  'Sybau Picture supports JPG, PNG, WebP formats • No registration required • 100% free to use',
  "{getText('home.footer.features', 'Sybau Picture supports JPG, PNG, WebP formats • No registration required • 100% free to use')}"
);

content = content.replace(
  'Secure Processing',
  "{getText('home.footer.secure', 'Secure Processing')}"
);

content = content.replace(
  '8-Second Generation',
  "{getText('home.footer.speed', '8-Second Generation')}"
);

content = content.replace(
  'Global Community',
  "{getText('home.footer.community', 'Global Community')}"
);

fs.writeFileSync(filePath, content);
console.log('✅ HomePageClient.tsx 硬编码英文文本修复完成!');
