# Vercel部署脚本 - Windows PowerShell版本

Write-Host "🚀 开始部署到Vercel..." -ForegroundColor Green

# 1. 检查环境变量
Write-Host "🔍 检查环境变量..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "✅ .env文件存在" -ForegroundColor Green
} else {
    Write-Host "❌ .env文件不存在" -ForegroundColor Red
    exit 1
}

# 2. 安装依赖
Write-Host "📦 安装依赖..." -ForegroundColor Yellow
npm install

# 3. 生成Prisma客户端
Write-Host "🔧 生成Prisma客户端..." -ForegroundColor Yellow
npx prisma generate

# 4. 构建项目
Write-Host "🏗️ 构建项目..." -ForegroundColor Yellow
npm run build

# 5. 部署到Vercel
Write-Host "🚀 部署到Vercel..." -ForegroundColor Yellow
npx vercel --prod

Write-Host "🎉 部署完成！" -ForegroundColor Green
