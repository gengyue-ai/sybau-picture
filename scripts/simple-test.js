const fs = require('fs');
const path = require('path');

console.log('🧪 检查Sybau Picture博客文件...\n');

// 检查博客数据文件
const sybauDataPath = path.join(__dirname, '../lib/sybau-blog-data.ts');
if (fs.existsSync(sybauDataPath)) {
  console.log('✅ Sybau博客数据文件存在');
} else {
  console.log('❌ Sybau博客数据文件缺失');
}

// 检查图片文件
console.log('\n🖼️  检查博客图片:');
const imageFiles = [
  'sybau-comeback-story.svg',
  'sybau-motivation-guide.svg',
  'sybau-funny-moments.svg',
  'sybau-weird-culture.svg'
];

let imagesExist = 0;
for (const imageFile of imageFiles) {
  const imagePath = path.join(__dirname, '../public/images/blog', imageFile);
  if (fs.existsSync(imagePath)) {
    imagesExist++;
    console.log(`✅ ${imageFile}`);
  } else {
    console.log(`❌ ${imageFile}`);
  }
}

// 检查作者头像
console.log('\n👤 检查作者头像:');
const authorFiles = [
  'alex-weird.svg',
  'chris-martinez.svg',
  'jake-chen.svg',
  'maya-rodriguez.svg'
];

let avatarsExist = 0;
for (const avatarFile of authorFiles) {
  const avatarPath = path.join(__dirname, '../public/images/blog/authors', avatarFile);
  if (fs.existsSync(avatarPath)) {
    avatarsExist++;
    console.log(`✅ ${avatarFile}`);
  } else {
    console.log(`❌ ${avatarFile}`);
  }
}

// 读取并显示博客数据内容
console.log('\n📝 检查博客文章内容:');
try {
  const sybauDataContent = fs.readFileSync(sybauDataPath, 'utf8');

  // 简单检查是否包含关键内容
  const hasLazerDim = sybauDataContent.includes('LAZER DIM 700');
  const hasComeback = sybauDataContent.includes('comeback');
  const hasMotivation = sybauDataContent.includes('motivation');
  const hasFunny = sybauDataContent.includes('funny');
  const hasWeird = sybauDataContent.includes('weird');

  console.log(`✅ 包含Lazer Dim 700内容: ${hasLazerDim}`);
  console.log(`✅ 包含comeback主题: ${hasComeback}`);
  console.log(`✅ 包含motivation主题: ${hasMotivation}`);
  console.log(`✅ 包含funny主题: ${hasFunny}`);
  console.log(`✅ 包含weird主题: ${hasWeird}`);

} catch (error) {
  console.log('❌ 无法读取博客数据文件');
}

console.log('\n🎯 总结:');
console.log(`📄 博客数据文件: ${fs.existsSync(sybauDataPath) ? '✅' : '❌'}`);
console.log(`🖼️  博客图片: ${imagesExist}/4 个`);
console.log(`👤 作者头像: ${avatarsExist}/4 个`);

if (fs.existsSync(sybauDataPath) && imagesExist === 4 && avatarsExist === 4) {
  console.log('\n🎉 所有文件都已准备好！');
  console.log('💡 现在可以启动开发服务器并访问 /blog 页面测试');
} else {
  console.log('\n⚠️  部分文件缺失，请检查上述错误');
}
