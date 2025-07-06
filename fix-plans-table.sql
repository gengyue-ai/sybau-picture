-- 修复plans表结构，使其匹配我们的Prisma schema

-- 1. 先检查现有plans表结构
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'plans' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 删除现有的plans表（如果存在）
DROP TABLE IF EXISTS public.plans CASCADE;

-- 3. 重新创建plans表，使用正确的字段名
CREATE TABLE public.plans (
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

-- 4. 插入默认的免费套餐
INSERT INTO public.plans (
    id,
    name,
    display_name,
    description,
    price,
    yearly_price,
    max_images_per_month,
    max_resolution,
    has_watermark,
    available_styles
) VALUES (
    'free_plan_001',
    'free',
    'Free',
    '免费套餐',
    0,
    0,
    10,
    '512x512',
    true,
    '["classic"]'
);

-- 5. 再次添加外键约束（如果users表已存在）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_plan_id_fkey;
        ALTER TABLE public.users ADD CONSTRAINT users_plan_id_fkey
        FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 6. 创建更新时间的触发器
DROP TRIGGER IF EXISTS update_plans_updated_at ON public.plans;
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. 验证结果
SELECT 'Plans table fixed successfully!' as result;
SELECT * FROM public.plans;
