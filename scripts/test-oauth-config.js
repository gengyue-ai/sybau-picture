#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

console.log('🔐 Google OAuth 配置检查:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '已设置' : '未设置');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '已设置' : '未设置');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '未设置');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '已设置' : '未设置');
