// 简单的API测试脚本
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API with text prompt...');

    const response = await fetch('http://localhost:3006/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Create a funny Sybau Lazer Dim 700 style meme with glowing eyes'
      })
    });

    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ API test successful!');
      console.log('Generated image URL:', result.imageUrl);
    } else {
      console.log('❌ API test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// 运行测试
testAPI();
