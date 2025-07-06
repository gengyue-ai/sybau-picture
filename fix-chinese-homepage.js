const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'HomePageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('修复HomePageClient.tsx中的硬编码英文文本...');

// 修复步骤1描述
content = content.replace(
  "description: 'Simply drag and drop or select any image from your device. Sybau Picture supports JPG, PNG, and WebP formats.',",
  "description: getText('home.howitworks.step1.desc', 'Simply drag and drop or select any image from your device. Sybau Picture supports JPG, PNG, and WebP formats.'),"
);

// 修复步骤2描述
content = content.replace(
  "description: 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.',",
  "description: getText('home.howitworks.step2.desc', 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.'),"
);

// 修复步骤3描述
content = content.replace(
  "description: 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.',",
  "description: getText('home.howitworks.step3.desc', 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.'),"
);

fs.writeFileSync(filePath, content);
console.log('✅ 修复完成！');
