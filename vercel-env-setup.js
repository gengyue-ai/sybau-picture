#!/usr/bin/env node

console.log('🔧 Vercel环境变量设置脚本');
console.log('==========================================');
console.log('');
console.log('请运行以下命令来设置环境变量：');
console.log('');

const envVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL',
  'FAL_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_STANDARD_MONTHLY',
  'STRIPE_PRICE_STANDARD_YEARLY',
  'STRIPE_PRICE_PRO_MONTHLY',
  'STRIPE_PRICE_PRO_YEARLY'
];

console.log('🚀 自动设置命令：');
console.log('');

envVars.forEach(envVar => {
  console.log(`vercel env add ${envVar} production`);
});

console.log('');
console.log('📋 或者手动在Vercel Dashboard设置：');
console.log('1. 访问：https://vercel.com/dashboard');
console.log('2. 选择项目：sybaupicture');
console.log('3. 进入Settings > Environment Variables');
console.log('4. 添加上述所有变量');
console.log('');
console.log('🔑 重要的变量值：');
console.log('NEXTAUTH_URL = https://sybaupicture-i9684zp8u-michaels-projects-a7bdff74.vercel.app');
console.log('DATABASE_URL = postgresql://postgres.niqywjbgqkfvuqhngbxm:Funinhand1122@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');
console.log('');
console.log('⚠️  其他变量需要从你的.env.local文件中复制');
