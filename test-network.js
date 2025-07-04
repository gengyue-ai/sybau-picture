// 网络诊断测试
const fetch = require('node-fetch');

async function testNetworkConnectivity() {
  console.log('=== 网络连接诊断 ===\n');

  // 测试1: 检查本地API服务器
  try {
    console.log('1. 测试本地API服务器...');
    const response = await fetch('http://localhost:3006/api/generate', {
      method: 'GET'
    });
    const result = await response.json();
    console.log('✅ 本地API服务器连接正常:', result.message);
  } catch (error) {
    console.log('❌ 本地API服务器连接失败:', error.message);
  }

  // 测试2: 检查Fal AI API连接
  try {
    console.log('\n2. 测试Fal AI API连接...');
    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': 'Key 71163de2-482a-46e5-821c-ccef71f7caae:2cec66a501188bdb77c78e85191693ba',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          prompt: 'test image',
          num_inference_steps: 1,
          num_images: 1
        }
      })
    });
    console.log('✅ Fal AI API连接状态:', response.status);
  } catch (error) {
    console.log('❌ Fal AI API连接失败:', error.message);
  }

  // 测试3: 检查基本网络连接
  try {
    console.log('\n3. 测试基本网络连接...');
    const response = await fetch('https://httpbin.org/get', {
      timeout: 5000
    });
    console.log('✅ 基本网络连接正常:', response.status);
  } catch (error) {
    console.log('❌ 基本网络连接失败:', error.message);
  }

  console.log('\n=== 诊断完成 ===');
}

testNetworkConnectivity();
