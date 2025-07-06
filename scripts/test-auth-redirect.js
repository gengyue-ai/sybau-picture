#!/usr/bin/env node

/**
 * 测试认证重定向
 * 验证登录后的跳转是否正常
 */

const http = require('http');

async function testAuthRedirect() {
  console.log('🔄 测试认证重定向');
  console.log('==================');
  console.log('');

  try {
    // 1. 测试登录页面是否可访问
    console.log('1️⃣  测试登录页面...');
    const signinResponse = await makeRequest('http://localhost:3001/auth/signin');

    if (signinResponse.statusCode === 200) {
      console.log('✅ 登录页面正常访问');
    } else {
      console.log(`❌ 登录页面错误: ${signinResponse.statusCode}`);
    }

    // 2. 测试首页是否可访问
    console.log('');
    console.log('2️⃣  测试首页跳转目标...');
    const homeResponse = await makeRequest('http://localhost:3001/');

    if (homeResponse.statusCode === 200) {
      console.log('✅ 首页正常访问 (登录后的跳转目标)');
    } else {
      console.log(`❌ 首页访问错误: ${homeResponse.statusCode}`);
    }

    // 3. 测试Google OAuth重定向流程
    console.log('');
    console.log('3️⃣  测试Google OAuth流程...');
    const googleAuthResponse = await makeRequest('http://localhost:3001/api/auth/signin/google');

    if (googleAuthResponse.statusCode === 302) {
      console.log('✅ Google OAuth重定向正常 (302状态码)');
      const location = googleAuthResponse.headers.location;
      if (location && location.includes('accounts.google.com')) {
        console.log('✅ 重定向到Google认证页面');
      }
    } else {
      console.log(`❌ Google OAuth流程错误: ${googleAuthResponse.statusCode}`);
    }

    console.log('');
    console.log('📋 测试结果总结:');
    console.log('================');
    console.log('');
    console.log('🎯 登录重定向修复内容:');
    console.log('- Google登录: callbackUrl 从 /generator 改为 /');
    console.log('- 邮箱登录: 重定向从 /generator 改为 /');
    console.log('- 添加了 redirect callback 处理登录后跳转');
    console.log('');
    console.log('🚀 现在测试登录流程:');
    console.log('1. 访问: http://localhost:3001/auth/signin');
    console.log('2. 点击 "Continue with Google"');
    console.log('3. 完成Google认证');
    console.log('4. 应该自动跳转回首页 (/)');
    console.log('');
    console.log('✅ 如果跳转正常，说明问题已解决！');

  } catch (error) {
    console.log('❌ 测试失败:', error.message);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('请求超时'));
    });
  });
}

testAuthRedirect().catch(console.error);
