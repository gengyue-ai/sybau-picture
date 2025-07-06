#!/bin/bash
# Vercel部署脚本

echo "🚀 开始部署到Vercel..."

# 1. 检查环境变量
echo "🔍 检查环境变量..."
if [ -f .env ]; then
    echo "✅ .env文件存在"
else
    echo "❌ .env文件不存在"
    exit 1
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm install

# 3. 生成Prisma客户端
echo "🔧 生成Prisma客户端..."
npx prisma generate

# 4. 构建项目
echo "🏗️ 构建项目..."
npm run build

# 5. 部署到Vercel
echo "🚀 部署到Vercel..."
npx vercel --prod

echo "🎉 部署完成！"
