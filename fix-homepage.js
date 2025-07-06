const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'HomePageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('修复HomePageClient.tsx中的硬编码英文文本...');

// 修复步骤2的描述
content = content.replace(
  "description: 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.',",
  "description: getText('home.howitworks.step2.desc', 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.'),"
);

// 修复步骤3的描述
content = content.replace(
  "description: 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.',",
  "description: getText('home.howitworks.step3.desc', 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.'),"
);

// 修复Secure & Private
content = content.replace(
  "title: 'Secure & Private',",
  "title: getText('home.features.secure.title', 'Secure & Private'),"
);

content = content.replace(
  "description: 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.',",
  "description: getText('home.features.secure.desc', 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.'),"
);

// 修复Global Community
content = content.replace(
  "title: 'Global Community',",
  "title: getText('home.features.community.title', 'Global Community'),"
);

content = content.replace(
  "description: 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.',",
  "description: getText('home.features.community.desc', 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.'),"
);

// 修复24/7 Available
content = content.replace(
  "title: '24/7 Available',",
  "title: getText('home.features.available.title', '24/7 Available'),"
);

content = content.replace(
  "description: 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.',",
  "description: getText('home.features.available.desc', 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.'),"
);

fs.writeFileSync(filePath, content);
console.log('✅ HomePageClient.tsx 硬编码英文文本修复完成!');
