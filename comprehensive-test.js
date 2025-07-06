const https = require('https');
const querystring = require('querystring');

console.log('🎯 综合测试 - 环境变量修复后的功能验证');

// 生成随机邮箱
const randomEmail = `test${Date.now()}@example.com`;

// 测试1：数据库连接
function testDatabaseConnection() {
    console.log('\n📊 测试1：数据库连接');
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.sybaupicture.com',
            port: 443,
            path: '/api/debug-prisma',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`状态码: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log('✅ 数据库连接正常');
                    try {
                        const parsed = JSON.parse(data);
                        console.log('用户数量:', parsed.userCount);
                        console.log('数据库状态:', parsed.success ? '健康' : '异常');
                    } catch (e) {
                        console.log('响应数据:', data);
                    }
                } else {
                    console.log('❌ 数据库连接失败');
                    console.log('响应:', data);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log('❌ 数据库连接错误:', err.message);
            resolve();
        });

        req.end();
    });
}

// 测试2：邮箱注册
function testEmailSignup() {
    console.log('\n📧 测试2：邮箱注册功能');
    console.log('测试邮箱:', randomEmail);

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
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`状态码: ${res.statusCode}`);
                if (res.statusCode === 201) {
                    console.log('✅ 邮箱注册成功');
                    try {
                        const user = JSON.parse(data);
                        console.log('用户ID:', user.user?.id);
                        console.log('用户邮箱:', user.user?.email);
                    } catch (e) {
                        console.log('响应数据:', data);
                    }
                } else {
                    console.log('❌ 邮箱注册失败');
                    console.log('响应:', data);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log('❌ 邮箱注册错误:', err.message);
            resolve();
        });

        req.write(postData);
        req.end();
    });
}

// 测试3：Google OAuth
function testGoogleOAuth() {
    console.log('\n🔐 测试3：Google OAuth功能');

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
            console.log(`状态码: ${res.statusCode}`);

            if (res.statusCode === 302) {
                const location = res.headers.location;
                console.log('重定向到:', location);

                if (location && location.includes('accounts.google.com')) {
                    console.log('✅ Google OAuth配置正常');
                    console.log('成功重定向到Google授权页面');
                } else if (location && location.includes('error=google')) {
                    console.log('❌ Google OAuth失败');
                    console.log('错误重定向，仍有配置问题');
                } else {
                    console.log('⚠️  Google OAuth状态未知');
                    console.log('重定向位置:', location);
                }
            } else {
                console.log('❌ Google OAuth请求失败');
                console.log('状态码:', res.statusCode);
            }
            resolve();
        });

        req.on('error', (err) => {
            console.log('❌ Google OAuth错误:', err.message);
            resolve();
        });

        req.end();
    });
}

// 执行所有测试
async function runAllTests() {
    console.log('开始综合测试...\n');

    await testDatabaseConnection();
    await testEmailSignup();
    await testGoogleOAuth();

    console.log('\n🎉 所有测试完成！');
}

runAllTests().catch(console.error);
