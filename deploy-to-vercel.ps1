#!/usr/bin/env pwsh

Write-Host "🚀 开始部署到Vercel..." -ForegroundColor Green

# 检查是否安装了Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未安装Vercel CLI，请先安装：" -ForegroundColor Red
    Write-Host "npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# 检查关键文件
Write-Host "📋 检查关键文件..." -ForegroundColor Cyan
$requiredFiles = @("package.json", "next.config.js", "prisma/schema.prisma")
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ $file 不存在" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ 关键文件检查通过" -ForegroundColor Green

# 构建检查
Write-Host "🔨 运行构建测试..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败，请修复错误后再部署" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 构建成功" -ForegroundColor Green

# 部署到Vercel
Write-Host "🌐 部署到Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "📝 请确保在Vercel控制台设置以下环境变量：" -ForegroundColor Yellow
Write-Host "   - DATABASE_URL" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_ID" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_SECRET" -ForegroundColor White
Write-Host "   - FAL_KEY" -ForegroundColor White
Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" -ForegroundColor White
Write-Host "   - STRIPE_WEBHOOK_SECRET" -ForegroundColor White
