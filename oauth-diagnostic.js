#!/usr/bin/env node

console.log('🔍 Google OAuth 诊断工具');
console.log('=' .repeat(40));

console.log('\n📋 检查清单：');
console.log('');

console.log('1. 🔐 Google Cloud Console 检查:');
console.log('   访问: https://console.cloud.google.com/apis/credentials');
console.log('   ✅ 确认项目正确');
console.log('   ✅ 找到客户端ID: 42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com');
console.log('');

console.log('2. 🌐 重定向URI检查:');
console.log('   应该包含以下所有URI:');
console.log('   ✅ http://localhost:3000/api/auth/callback/google');
console.log('   ✅ https://sybaupicture.com/api/auth/callback/google');
console.log('   ✅ https://www.sybaupicture.com/api/auth/callback/google');
console.log('');

console.log('3. 🚀 应用状态检查:');
console.log('   访问: https://console.cloud.google.com/apis/credentials/consent');
console.log('   ✅ 状态应该是 "In production"');
console.log('   ❌ 如果是 "Testing" → 点击 "PUBLISH APP"');
console.log('');

console.log('4. 👥 测试用户检查:');
console.log('   如果应用仍在测试模式:');
console.log('   ✅ 添加测试用户: pamyongjiang095@gmail.com');
console.log('');

console.log('5. 🏠 授权域名检查:');
console.log('   在 OAuth 同意屏幕中添加:');
console.log('   ✅ sybaupicture.com');
console.log('');

console.log('6. 🔧 环境变量检查:');
console.log('   运行: vercel env ls | findstr GOOGLE');
console.log('   ✅ GOOGLE_CLIENT_ID 已设置');
console.log('   ✅ GOOGLE_CLIENT_SECRET 已设置');
console.log('');

console.log('7. 🧪 测试步骤:');
console.log('   1. 访问: https://sybaupicture.com');
console.log('   2. 点击登录按钮');
console.log('   3. 选择 Google 登录');
console.log('   4. 应该能正常跳转');
console.log('');

console.log('⚠️  最常见问题: 应用还在测试模式！');
console.log('🎯 解决方案: 发布应用到生产环境！');
console.log('');

console.log('📞 需要帮助？');
console.log('   1. 检查 Google Cloud Console 项目');
console.log('   2. 确保应用已发布到生产环境');
console.log('   3. 等待配置生效（几分钟）');
console.log('   4. 使用无痕模式测试');
