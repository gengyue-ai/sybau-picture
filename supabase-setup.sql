-- Supabase 数据库表创建脚本
-- 请在 Supabase SQL 编辑器中执行这些语句

-- 1. 首先删除已存在的表（如果有）
DROP TABLE IF EXISTS public.verificationtokens CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.generated_images CASCADE;
DROP TABLE IF EXISTS public.translations CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.system_config CASCADE;
DROP TABLE IF EXISTS public.usage_stats CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.user_usage CASCADE;

-- 2. 创建 Plans 表（套餐表）
CREATE TABLE public.plans (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    features JSONB,
    limitations JSONB,
    stripe_price_id TEXT,
    stripe_yearly_price_id TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 Users 表
CREATE TABLE public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT,
    image TEXT,
    email_verified TIMESTAMP WITH TIME ZONE,
    plan_id TEXT REFERENCES public.plans(id),
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建 Accounts 表（NextAuth）
CREATE TABLE public.accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
    UNIQUE(provider, provider_account_id)
);

-- 5. 创建 Sessions 表（NextAuth）
CREATE TABLE public.sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 6. 创建 VerificationTokens 表（NextAuth）
CREATE TABLE public.verificationtokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(identifier, token)
);

-- 7. 创建 GeneratedImages 表
CREATE TABLE public.generated_images (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 创建 Translations 表
CREATE TABLE public.translations (
    id TEXT PRIMARY KEY,
    page_path TEXT NOT NULL,
    lang_code TEXT NOT NULL,
    content TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(page_path, lang_code)
);

-- 9. 创建 BlogPosts 表
CREATE TABLE public.blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    keywords TEXT,
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 创建 SystemConfig 表
CREATE TABLE public.system_config (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 创建 UsageStats 表
CREATE TABLE public.usage_stats (
    id TEXT PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    metric TEXT NOT NULL,
    value INTEGER NOT NULL,
    metadata TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, metric)
);

-- 12. 创建 Subscriptions 表
CREATE TABLE public.subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.plans(id),
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. 创建 UserUsage 表
CREATE TABLE public.user_usage (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    value INTEGER NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, metric, period_start)
);

-- 14. 创建索引以提高性能
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_generated_images_user_id ON public.generated_images(user_id);
CREATE INDEX idx_generated_images_created_at ON public.generated_images(created_at);
CREATE INDEX idx_generated_images_style ON public.generated_images(style);
CREATE INDEX idx_generated_images_view_count ON public.generated_images(view_count);
CREATE INDEX idx_translations_page_path ON public.translations(page_path);
CREATE INDEX idx_translations_lang_code ON public.translations(lang_code);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX idx_system_config_category ON public.system_config(category);
CREATE INDEX idx_usage_stats_date ON public.usage_stats(date);
CREATE INDEX idx_usage_stats_metric ON public.usage_stats(metric);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_user_usage_user_id ON public.user_usage(user_id);

-- 15. 插入默认套餐数据
INSERT INTO public.plans (id, name, display_name, description, price, yearly_price, currency, features, limitations, stripe_price_id, stripe_yearly_price_id, is_active, sort_order) VALUES
('free', 'free', 'Free', 'Perfect for trying out our service', 0.00, 0.00, 'USD', '{"images_per_month": 10, "styles": ["classic"], "priority_support": false}', '{"monthly_limit": 10}', null, null, true, 1),
('standard', 'standard', 'Standard', 'Great for regular users', 9.00, 90.00, 'USD', '{"images_per_month": 100, "styles": ["classic", "minimal"], "priority_support": true}', '{"monthly_limit": 100}', 'price_1QV1P8KBvzJv8bGKQG1kzTHF', null, true, 2),
('pro', 'pro', 'PRO', 'Best for power users and professionals', 19.00, 190.00, 'USD', '{"images_per_month": 500, "styles": ["classic", "minimal", "exaggerated"], "priority_support": true, "api_access": true}', '{"monthly_limit": 500}', 'price_1QV1PqKBvzJv8bGKnvGlUNgU', null, true, 3);

-- 16. 插入系统配置
INSERT INTO public.system_config (id, key, value, category) VALUES
('sys_001', 'app_name', 'Sybau Picture', 'general'),
('sys_002', 'app_version', '1.0.0', 'general'),
('sys_003', 'maintenance_mode', 'false', 'general'),
('sys_004', 'default_image_style', 'classic', 'images'),
('sys_005', 'max_image_size', '10485760', 'images');

-- 验证表创建
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
