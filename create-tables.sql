
    -- 创建用户表
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

    -- 创建账户表
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

    -- 创建会话表
    CREATE TABLE IF NOT EXISTS "Session" (
        id TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        expires TIMESTAMP NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
    );

    -- 创建验证令牌表
    CREATE TABLE IF NOT EXISTS "VerificationToken" (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
    );

    -- 创建生成历史表
    CREATE TABLE IF NOT EXISTS "GenerationHistory" (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
    );
    