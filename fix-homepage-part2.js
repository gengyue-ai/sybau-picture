const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'HomePageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('修复HomePageClient.tsx中的用例好处列表...');

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

// 修复社区统计数据标签
content = content.replace(
  /Active Users/g,
  "{getText('home.community.stats.users.label', 'Active Users')}"
);

content = content.replace(
  /Daily Creations/g,
  "{getText('home.community.stats.creations.label', 'Daily Creations')}"
);

content = content.replace(
  /Satisfaction Rate/g,
  "{getText('home.community.stats.satisfaction.label', 'Satisfaction Rate')}"
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

fs.writeFileSync(filePath, content);
console.log('✅ HomePageClient.tsx 用例好处列表修复完成!');
