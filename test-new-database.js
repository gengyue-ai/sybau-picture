const { PrismaClient } = require('@prisma/client');

console.log('🔍 测试新的Supabase数据库连接');

async function testNewDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('📊 连接到新数据库...');

        // 测试基本连接
        await prisma.$connect();
        console.log('✅ 数据库连接成功');

        // 测试表是否存在
        console.log('🔍 检查数据表...');
        const userCount = await prisma.user.count();
        console.log(`用户表: ${userCount} 条记录`);

        const historyCount = await prisma.generationHistory.count();
        console.log(`生成历史表: ${historyCount} 条记录`);

        const accountCount = await prisma.account.count();
        console.log(`账户表: ${accountCount} 条记录`);

        const sessionCount = await prisma.session.count();
        console.log(`会话表: ${sessionCount} 条记录`);

        console.log('✅ 所有数据表都正常');

        // 测试创建用户
        console.log('\n🧪 测试创建用户...');
        const testUser = await prisma.user.create({
            data: {
                name: 'Test User',
                email: `test-${Date.now()}@example.com`,
                plan: 'free'
            }
        });

        console.log('✅ 用户创建成功:', testUser.email);

        // 删除测试用户
        await prisma.user.delete({
            where: { id: testUser.id }
        });
        console.log('✅ 测试用户已删除');

    } catch (error) {
        console.log('❌ 数据库测试失败:', error.message);
        console.log('错误详情:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testNewDatabase().catch(console.error);
