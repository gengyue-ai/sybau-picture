const { execSync } = require('child_process');

console.log('🔧 设置新的Vercel Supabase数据库');

async function setupNewDatabase() {
    console.log('📋 数据库设置步骤：');
    console.log('');

    // 第1步：检查新环境变量
    console.log('1️⃣ 检查新的环境变量...');
    try {
        console.log('拉取最新的环境变量...');
        execSync('vercel env pull --environment=production .env.new', { stdio: 'inherit' });
        console.log('✅ 环境变量已拉取到 .env.new');
    } catch (error) {
        console.log('❌ 拉取环境变量失败:', error.message);
        return;
    }

    // 第2步：运行数据库迁移
    console.log('\n2️⃣ 运行数据库迁移...');
    try {
        console.log('生成Prisma客户端...');
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Prisma客户端已生成');

        console.log('运行数据库迁移...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ 数据库迁移完成');
    } catch (error) {
        console.log('❌ 数据库迁移失败:', error.message);
        console.log('');
        console.log('🔧 手动迁移步骤：');
        console.log('1. 复制 .env.new 的内容到 .env');
        console.log('2. 运行: npx prisma migrate deploy');
        console.log('3. 运行: npx prisma generate');
        return;
    }

    // 第3步：重新部署应用
    console.log('\n3️⃣ 重新部署应用...');
    try {
        console.log('部署应用到生产环境...');
        execSync('vercel --prod', { stdio: 'inherit' });
        console.log('✅ 应用部署完成');
    } catch (error) {
        console.log('❌ 应用部署失败:', error.message);
        return;
    }

    console.log('\n🎉 数据库设置完成！');
    console.log('');
    console.log('📊 下一步：运行测试验证功能');
    console.log('运行: node comprehensive-test.js');
}

// 检查是否已经创建了新数据库
console.log('请确保已经在Vercel界面创建了Supabase数据库');
console.log('创建完成后，按回车键继续...');

// 等待用户确认
process.stdin.once('data', () => {
    setupNewDatabase().catch(console.error);
});

console.log('等待用户确认...');
