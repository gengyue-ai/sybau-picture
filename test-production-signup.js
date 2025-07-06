const https = require('https');
const querystring = require('querystring');

console.log('🔍 测试生产环境注册API');

// 生成随机邮箱
const randomEmail = `test${Date.now()}@example.com`;

// 测试邮箱注册API
function testEmailSignup() {
    return new Promise((resolve, reject) => {
        const postData = querystring.stringify({
            name: 'Test User',
            email: randomEmail,
            password: 'TestPassword123!'
        });

        const options = {
            hostname: 'www.sybaupicture.com',
            port: 443,
            path: '/api/auth/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(`状态码: ${res.statusCode}`);
                console.log(`响应头:`, res.headers);
                console.log(`响应体:`, body);

                if (res.statusCode === 201) {
                    console.log('✅ 注册成功！');
                    resolve({ success: true, data: JSON.parse(body) });
                } else {
                    console.log('❌ 注册失败');
                    resolve({ success: false, error: body, statusCode: res.statusCode });
                }
            });
        });

        req.on('error', (e) => {
            console.error('请求错误:', e);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

// 测试Google OAuth
function testGoogleOAuth() {
    return new Promise((resolve, reject) => {
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
            const location = res.headers.location;
            console.log(`Google OAuth状态码: ${res.statusCode}`);
            console.log(`重定向到: ${location}`);

            if (location && location.includes('accounts.google.com')) {
                console.log('✅ Google OAuth正常！');
                resolve({ success: true });
            } else {
                console.log('❌ Google OAuth失败');
                resolve({ success: false, redirect: location });
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
        console.log('\n=== 测试邮箱注册 ===');
        console.log(`使用邮箱: ${randomEmail}`);

        const signupResult = await testEmailSignup();

        if (signupResult.success) {
            console.log('🎉 邮箱注册测试通过！');
        } else {
            console.log('❌ 邮箱注册测试失败');
            console.log('错误信息:', signupResult.error);
        }

        console.log('\n=== 测试Google OAuth ===');
        const oauthResult = await testGoogleOAuth();

        if (oauthResult.success) {
            console.log('🎉 Google OAuth测试通过！');
        } else {
            console.log('❌ Google OAuth测试失败');
        }

        console.log('\n=== 测试完成 ===');

    } catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}

runTests();
