const fs = require('fs');
const path = require('path');

// 读取文件
const filePath = path.join(__dirname, 'components', 'HomePageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('修复HomePageClient.tsx中的硬编码英文文本...');

// 修复"如何工作"部分的描述
content = content.replace(
  'Creating viral memes with Sybau Picture is simple, fast, and completely free. Our AI-powered platform transforms your photos into engaging Sybau-style content in three easy steps.',
  "{getText('home.howitworks.description', 'Creating viral memes with Sybau Picture is simple, fast, and completely free. Our AI-powered platform transforms your photos into engaging Sybau-style content in three easy steps.')}"
);

// 修复步骤描述
content = content.replace(
  "description: 'Simply drag and drop or select any image from your device. Sybau Picture supports JPG, PNG, and WebP formats.',",
  "description: getText('home.howitworks.step1.desc', 'Simply drag and drop or select any image from your device. Sybau Picture supports JPG, PNG, and WebP formats.'),"
);

content = content.replace(
  "description: 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.',",
  "description: getText('home.howitworks.step2.desc', 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.'),"
);

content = content.replace(
  "description: 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.',",
  "description: getText('home.howitworks.step3.desc', 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.'),"
);

// 修复功能部分的硬编码文本
content = content.replace(
  /title: 'Secure & Private',/g,
  `title: getText('home.features.secure.title', 'Secure & Private'),`
);

content = content.replace(
  /description: 'Your images are processed securely and never stored on our servers\. Sybau Picture respects your privacy\.',/g,
  `description: getText('home.features.secure.desc', 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.'),`
);

content = content.replace(
  /title: 'Global Community',/g,
  `title: getText('home.features.community.title', 'Global Community'),`
);

content = content.replace(
  /description: 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs\.',/g,
  `description: getText('home.features.community.desc', 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.'),`
);

content = content.replace(
  /title: '24\/7 Available',/g,
  `title: getText('home.features.available.title', '24/7 Available'),`
);

content = content.replace(
  /description: 'Create memes anytime, anywhere with Sybau Picture\. Our platform is always ready when inspiration strikes\.',/g,
  `description: getText('home.features.available.desc', 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.'),`
);

// 修复用例部分的描述
content = content.replace(
  /Whether you're a professional marketer or casual content creator, Sybau Picture empowers everyone to create viral memes that capture attention and drive engagement\./g,
  `{getText('home.usecases.description', 'Whether you\\'re a professional marketer or casual content creator, Sybau Picture empowers everyone to create viral memes that capture attention and drive engagement.')}`
);

// 修复用例描述
content = content.replace(
  /description: 'Create engaging content for brands and businesses with Sybau Picture\\'s professional-grade results\.',/g,
  `description: getText('home.usecases.social.desc', 'Create engaging content for brands and businesses with Sybau Picture\\'s professional-grade results.'),`
);

content = content.replace(
  /description: 'Stand out on platforms like TikTok, Instagram, and YouTube with unique Sybau Picture creations\.',/g,
  `description: getText('home.usecases.content.desc', 'Stand out on platforms like TikTok, Instagram, and YouTube with unique Sybau Picture creations.'),`
);

content = content.replace(
  /description: 'Boost campaign performance with eye-catching memes that resonate with your target audience\.',/g,
  `description: getText('home.usecases.marketing.desc', 'Boost campaign performance with eye-catching memes that resonate with your target audience.'),`
);

content = content.replace(
  /description: 'Share funny moments with friends and family using Sybau Picture\\'s entertaining transformations\.',/g,
  `description: getText('home.usecases.individuals.desc', 'Share funny moments with friends and family using Sybau Picture\\'s entertaining transformations.'),`
);

// 修复好处文本
const benefits = [
  { old: "'Brand engagement'", new: "getText('home.usecases.benefits.engagement', 'Brand engagement')" },
  { old: "'Viral content'", new: "getText('home.usecases.benefits.viral', 'Viral content')" },
  { old: "'Time efficient'", new: "getText('home.usecases.benefits.efficient', 'Time efficient')" },
  { old: "'Audience growth'", new: "getText('home.usecases.benefits.growth', 'Audience growth')" },
  { old: "'Unique style'", new: "getText('home.usecases.benefits.unique', 'Unique style')" },
  { old: "'Easy creation'", new: "getText('home.usecases.benefits.easy', 'Easy creation')" },
  { old: "'Higher CTR'", new: "getText('home.usecases.benefits.ctr', 'Higher CTR')" },
  { old: "'Cost effective'", new: "getText('home.usecases.benefits.cost', 'Cost effective')" },
  { old: "'Quick turnaround'", new: "getText('home.usecases.benefits.quick', 'Quick turnaround')" },
  { old: "'Personal fun'", new: "getText('home.usecases.benefits.fun', 'Personal fun')" },
  { old: "'Social sharing'", new: "getText('home.usecases.benefits.sharing', 'Social sharing')" },
  { old: "'Creative expression'", new: "getText('home.usecases.benefits.expression', 'Creative expression')" }
];

benefits.forEach(benefit => {
  content = content.replace(new RegExp(benefit.old, 'g'), benefit.new);
});

// 修复社区部分
content = content.replace(
  /Share your creations, get inspired, and discover new ways to use our platform\./g,
  `{getText('home.community.extended', 'Share your creations, get inspired, and discover new ways to use our platform.')}`
);

// 修复统计数据标签
content = content.replace(
  /<div className="text-gray-600">Active Users<\/div>/g,
  `<div className="text-gray-600">{getText('home.community.stats.users', 'Active Users')}</div>`
);

content = content.replace(
  /<div className="text-gray-600">Daily Creations<\/div>/g,
  `<div className="text-gray-600">{getText('home.community.stats.creations', 'Daily Creations')}</div>`
);

content = content.replace(
  /<div className="text-gray-600">Satisfaction Rate<\/div>/g,
  `<div className="text-gray-600">{getText('home.community.stats.satisfaction', 'Satisfaction Rate')}</div>`
);

// 写入修改后的文件
fs.writeFileSync(filePath, content);
console.log('✅ HomePageClient.tsx 硬编码英文文本修复完成！');
