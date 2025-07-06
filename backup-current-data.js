const { execSync } = require('child_process');

console.log('📦 备份现有数据库数据');

// 当前数据库URL（去掉换行符）
const currentDbUrl = 'postgresql://postgres.niqywjbgqkfvuqhngbxm:Funinhand1122@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

console.log('🔍 连接到现有数据库，备份用户数据...');

// 创建备份SQL
const backupSql = `
-- 备份用户表数据
SELECT
    id,
    name,
    email,
    image,
    "emailVerified",
    plan,
    "planExpiration",
    "createdAt",
    "updatedAt"
FROM "User";

-- 备份生成历史表数据
SELECT
    id,
    prompt,
    "imageUrl",
    "userId",
    "createdAt"
FROM "GenerationHistory";

-- 备份账户表数据
SELECT
    id,
    "userId",
    type,
    provider,
    "providerAccountId",
    refresh_token,
    access_token,
    expires_at,
    token_type,
    scope,
    id_token,
    session_state
FROM "Account";

-- 备份会话表数据
SELECT
    id,
    "sessionToken",
    "userId",
    expires
FROM "Session";
`;

// 创建备份脚本
const backupScript = `
-- 备份数据库 (${new Date().toISOString()})
-- 原数据库: ${currentDbUrl}

-- 用户表结构
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    image TEXT,
    "emailVerified" TIMESTAMP,
    plan TEXT DEFAULT 'free',
    "planExpiration" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 生成历史表结构
CREATE TABLE IF NOT EXISTS "GenerationHistory" (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- 账户表结构
CREATE TABLE IF NOT EXISTS "Account" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- 会话表结构
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- 验证令牌表结构
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMP NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- 注意：实际数据需要从原数据库导出后插入
-- 当前数据库连接问题，无法直接查询数据
-- 请在新数据库创建后，手动运行 Prisma migrate 来创建表结构
`;

// 写入备份文件
require('fs').writeFileSync('database-backup.sql', backupScript);

console.log('✅ 备份脚本已创建：database-backup.sql');
console.log('');
console.log('📋 下一步操作：');
console.log('1. 在Vercel界面点击Supabase的"Create"按钮');
console.log('2. 等待数据库创建完成');
console.log('3. 数据库创建后，运行 prisma migrate 来创建表结构');
console.log('4. 如果有重要数据，需要手动迁移（当前数据库连接有问题）');
console.log('');
console.log('🎯 创建新数据库的优势：');
console.log('- 自动配置正确的环境变量');
console.log('- 避免换行符问题');
console.log('- 与Vercel深度集成');
console.log('- 更可靠的连接');
