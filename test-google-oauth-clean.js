const https = require('https');
const querystring = require('querystring');

console.log('🔍 测试Google OAuth - 清理换行符后');

// 测试Google OAuth登录
function testGoogleOAuth() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.sybaupicture.com',
            port: 443,
            path: '/api/auth/signin/google',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        const req = https.request(options, (res) => {
            console.log(`状态码: ${res.statusCode}`);
            console.log(`响应头:`, res.headers);

            if (res.statusCode === 302) {
                const location = res.headers.location;
                console.log(`重定向到: ${location}`);

                if (location && location.includes('accounts.google.com')) {
                    console.log('✅ Google OAuth重定向成功!');
                    resolve({ success: true, redirect: location });
                } else if (location && location.includes('error=google')) {
                    console.log('❌ Google OAuth仍然失败');
                    resolve({ success: false, error: 'Google OAuth错误', redirect: location });
                } else {
                    console.log('⚠️ 未知重定向');
                    resolve({ success: false, error: '未知重定向', redirect: location });
                }
            } else {
                console.log(`⚠️ 意外的状态码: ${res.statusCode}`);
                resolve({ success: false, error: `状态码 ${res.statusCode}` });
            }
        });

        req.on('error', (e) => {
            console.error('请求错误:', e);
            reject(e);
        });

        req.end();
    });
}

// 执行测试
async function runTests() {
    try {
        console.log('\n=== 测试Google OAuth ===');
        const result = await testGoogleOAuth();

        if (result.success) {
            console.log('🎉 Google OAuth测试通过！');
            console.log('用户可以正常使用Google登录');
        } else {
            console.log('❌ Google OAuth测试失败');
            console.log('错误:', result.error);
        }

        console.log('\n=== 测试完成 ===');

    } catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}

runTests();
