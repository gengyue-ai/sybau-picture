-- 创建Sybau Picture项目所需的数据库表
-- 执行前请确保连接到正确的数据库

-- 1. 创建用户表 (public.users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT,
    image TEXT,
    email_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    plan_id TEXT,
    stripe_customer_id TEXT UNIQUE
);

-- 2. 创建NextAuth必需的表
CREATE TABLE IF NOT EXISTS public.accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT accounts_provider_provider_account_id_key UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS public.sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.verificationtokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    CONSTRAINT verificationtokens_identifier_token_key UNIQUE (identifier, token)
);

-- 3. 创建套餐表
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    max_images_per_month INTEGER NOT NULL,
    max_resolution TEXT NOT NULL,
    has_watermark BOOLEAN DEFAULT true,
    has_priority_processing BOOLEAN DEFAULT false,
    has_batch_processing BOOLEAN DEFAULT false,
    has_advanced_features BOOLEAN DEFAULT false,
    available_styles TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建生成图片表
CREATE TABLE IF NOT EXISTS public.generated_images (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    original_url TEXT NOT NULL,
    processed_url TEXT NOT NULL,
    thumbnail_url TEXT,
    style TEXT DEFAULT 'classic',
    intensity INTEGER DEFAULT 2,
    style_version TEXT DEFAULT 'v2.1.3',
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    processing_time DECIMAL(10,3),
    file_size INTEGER,
    ip_hash TEXT,
    metadata TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT generated_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 5. 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan_id ON public.users(plan_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON public.generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON public.generated_images(created_at);
CREATE INDEX IF NOT EXISTS idx_generated_images_style ON public.generated_images(style);

-- 6. 插入默认的免费套餐
INSERT INTO public.plans (id, name, display_name, description, price, yearly_price, max_images_per_month, max_resolution, has_watermark, available_styles)
VALUES
('free_plan_001', 'free', 'Free', '免费套餐', 0, 0, 10, '512x512', true, '["classic"]')
ON CONFLICT (name) DO NOTHING;

-- 7. 添加外键约束
ALTER TABLE public.users ADD CONSTRAINT users_plan_id_fkey
FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE SET NULL;

-- 8. 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_images_updated_at BEFORE UPDATE ON public.generated_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 完成
SELECT 'Database setup completed successfully!' as result;
