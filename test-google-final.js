const https = require('https');

console.log('🔍 测试Google OAuth（生产环境）...\n');

function testGoogleOAuthProduction() {
  return new Promise((resolve) => {
    console.log('测试Google OAuth登录发起...');

    const options = {
      hostname: 'www.sybaupicture.com',
      port: 443,
      path: '/api/auth/signin/google',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`状态码: ${res.statusCode}`);

      if (res.headers.location) {
        console.log('重定向URL:', res.headers.location);

        // 检查是否包含错误
        if (res.headers.location.includes('error=google')) {
          console.log('❌ 仍然有Google OAuth错误');
        } else if (res.headers.location.includes('accounts.google.com')) {
          console.log('✅ 成功重定向到Google OAuth！');
        } else {
          console.log('🔄 重定向到其他页面');
        }
      }

      resolve(res.statusCode);
    });

    req.on('error', (e) => {
      console.log(`❌ 请求错误: ${e.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log('❌ 请求超时');
      resolve(false);
    });

    req.end();
  });
}

testGoogleOAuthProduction().then(() => {
  console.log('\n🎯 测试完成！');
  console.log('请访问 https://www.sybaupicture.com 测试Google登录功能');
}).catch(console.error);
