#!/bin/bash
# Vercel部署脚本

echo "🚀 开始部署到Vercel..."

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未安装Vercel CLI，请先安装："
    echo "npm i -g vercel"
    exit 1
fi

# 检查关键文件
echo "📋 检查关键文件..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json 不存在"
    exit 1
fi
if [ ! -f "next.config.js" ]; then
    echo "❌ next.config.js 不存在"
    exit 1
fi
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ prisma/schema.prisma 不存在"
    exit 1
fi

echo "✅ 关键文件检查通过"

# 构建检查
echo "🔨 运行构建测试..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请修复错误后再部署"
    exit 1
fi

echo "✅ 构建成功"

# 部署到Vercel
echo "🌐 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "📝 请确保在Vercel控制台设置以下环境变量："
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - FAL_KEY"
echo "   - STRIPE_SECRET_KEY"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   - STRIPE_WEBHOOK_SECRET"
