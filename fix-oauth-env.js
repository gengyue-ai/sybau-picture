const { execSync } = require('child_process');

console.log('🔧 修复Google OAuth环境变量');

// 正确的环境变量值（不含换行符）
const correctEnvVars = {
    'GOOGLE_CLIENT_ID': '42563097606-k876i2o56atm8ih9ibguijgr358tfkrl.apps.googleusercontent.com',
    'GOOGLE_CLIENT_SECRET': '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',
    'NEXTAUTH_SECRET': 'cUAwVabc8IES1N2TFK5jp7AeLCN5bFhKmar8si3tDc=',
    'NEXTAUTH_URL': 'https://www.sybaupicture.com'
};

function runCommand(command, description) {
    console.log(`\n${description}...`);
    try {
        const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        console.log('✅ 成功');
        return result;
    } catch (error) {
        console.log('❌ 失败:', error.message);
        return null;
    }
}

async function fixEnvironmentVariables() {
    console.log('正在修复环境变量...\n');

    // 删除并重新创建每个环境变量
    for (const [key, value] of Object.entries(correctEnvVars)) {
        console.log(`处理 ${key}...`);

        // 删除旧变量
        runCommand(`vercel env rm ${key} production --yes`, `删除旧的 ${key}`);

        // 等待一下
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 添加新变量
        runCommand(`echo "${value}" | vercel env add ${key} production`, `添加新的 ${key}`);

        // 等待一下
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎉 所有环境变量已更新！');
    console.log('现在重新部署应用...\n');

    // 重新部署
    runCommand('vercel --prod', '重新部署应用');

    console.log('\n✅ 修复完成！');
}

fixEnvironmentVariables().catch(console.error);
