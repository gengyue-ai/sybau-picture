-- 禁用RLS以便NextAuth正常工作
-- 在Supabase SQL编辑器中执行

-- 禁用NextAuth相关表的RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verificationtokens DISABLE ROW LEVEL SECURITY;

-- 为其他表启用RLS（可选，根据需要）
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略（可选）
-- 只有用户本人可以查看自己的生成图片
CREATE POLICY "用户只能查看自己的图片" ON public.generated_images
    FOR SELECT USING (auth.uid()::text = user_id);

-- 只有用户本人可以查看自己的订阅
CREATE POLICY "用户只能查看自己的订阅" ON public.subscriptions
    FOR SELECT USING (auth.uid()::text = user_id);
