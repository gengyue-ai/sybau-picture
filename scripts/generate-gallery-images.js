const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 画廊图片数据
const galleryImages = [
  {
    id: '1',
    filename: 'lucky-girl.jpg',
    prompt: 'a lucky girl with bright smile and optimistic expression, natural lighting, portrait photography',
    title: 'Lucky Girl Portrait',
    description: 'A beautiful portrait showcasing positive energy and optimism'
  },
  {
    id: '2',
    filename: 'business-leader.jpg',
    prompt: 'confident business person in suit, professional lighting, corporate portrait, office background',
    title: 'Confident Business Leader',
    description: 'Professional portrait perfect for corporate use'
  },
  {
    id: '3',
    filename: 'creative-portrait.jpg',
    prompt: 'artistic portrait with creative composition, dramatic lighting, modern art style',
    title: 'Creative Portrait',
    description: 'Artistic style capturing unique creative expression'
  },
  {
    id: '4',
    filename: 'contemporary-look.jpg',
    prompt: 'modern portrait with clean aesthetics, minimalist background, contemporary style',
    title: 'Contemporary Look',
    description: 'Modern processing highlighting contemporary style'
  },
  {
    id: '5',
    filename: 'dynamic-expression.jpg',
    prompt: 'expressive portrait with dynamic lighting, energetic mood, vibrant colors',
    title: 'Dynamic Expression',
    description: 'High-energy creation capturing dynamic emotional expression'
  },
  {
    id: '6',
    filename: 'elegant-portrait.jpg',
    prompt: 'elegant portrait with sophisticated styling, soft lighting, refined composition',
    title: 'Elegant Portrait',
    description: 'Sophisticated style emphasizing elegance and refinement'
  }
];

// 确保目录存在
const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// 下载图片的函数
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // 删除失败的文件
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 调用API生成图片
async function generateImage(prompt) {
  try {
    console.log(`🎨 生成图片: "${prompt}"`);

    const response = await fetch('http://localhost:3002/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.imageUrl) {
      console.log(`✅ 图片生成成功: ${result.imageUrl}`);
      return result.imageUrl;
    } else {
      throw new Error(`生成失败: ${result.error || '未知错误'}`);
    }
  } catch (error) {
    console.error(`❌ 生成图片失败:`, error);
    throw error;
  }
}

// 主函数
async function generateAllGalleryImages() {
  console.log('🚀 开始生成画廊图片...');
  console.log(`目标目录: ${galleryDir}`);

  for (let i = 0; i < galleryImages.length; i++) {
    const image = galleryImages[i];
    const filepath = path.join(galleryDir, image.filename);

    try {
      console.log(`\n📸 [${i + 1}/${galleryImages.length}] 处理: ${image.title}`);

      // 生成图片
      const imageUrl = await generateImage(image.prompt);

      // 下载并保存图片
      console.log(`📥 下载图片到: ${image.filename}`);
      await downloadImage(imageUrl, filepath);

      console.log(`✅ 完成: ${image.filename}`);

      // 添加延迟避免API限制
      if (i < galleryImages.length - 1) {
        console.log('⏳ 等待3秒...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

    } catch (error) {
      console.error(`❌ 处理失败 ${image.title}:`, error.message);

      // 如果是API限制，等待更长时间
      if (error.message.includes('rate limit')) {
        console.log('⏳ API限制，等待30秒...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        i--; // 重试当前图片
      }
    }
  }

  console.log('\n🎉 所有画廊图片生成完成！');
  console.log(`📁 图片保存在: ${galleryDir}`);

  // 列出生成的文件
  const files = fs.readdirSync(galleryDir);
  console.log('\n📋 生成的文件:');
  files.forEach(file => {
    const filepath = path.join(galleryDir, file);
    const stats = fs.statSync(filepath);
    console.log(`  - ${file} (${Math.round(stats.size / 1024)}KB)`);
  });
}

// 检查开发服务器是否运行
async function checkDevServer() {
  try {
    const response = await fetch('http://localhost:3002/api/generate');
    if (response.ok) {
      console.log('✅ 开发服务器正在运行');
      return true;
    }
  } catch (error) {
    console.error('❌ 开发服务器未运行，请先启动: npm run dev');
    return false;
  }
  return false;
}

// 执行
async function main() {
  console.log('🔍 检查开发服务器状态...');

  const serverRunning = await checkDevServer();
  if (!serverRunning) {
    process.exit(1);
  }

  await generateAllGalleryImages();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateAllGalleryImages, galleryImages };
