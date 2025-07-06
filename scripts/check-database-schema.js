#!/usr/bin/env node

/**
 * 检查数据库实际表结构
 */

const { Client } = require('pg');

async function checkDatabaseSchema() {
  console.log('🔍 检查数据库实际表结构...');
  console.log('===============================');
  console.log('');

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ 数据库连接成功');
    console.log('');

    // 检查所有表
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    const tablesResult = await client.query(tablesQuery);
    console.log('📋 数据库中的表:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    console.log('');

    // 检查 users 表结构
    if (tablesResult.rows.find(r => r.table_name === 'users')) {
      console.log('👤 users 表字段:');
      const usersColumnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      const usersResult = await client.query(usersColumnsQuery);
      usersResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      console.log('');
    }

    // 检查 accounts 表结构
    if (tablesResult.rows.find(r => r.table_name === 'accounts')) {
      console.log('🔑 accounts 表字段:');
      const accountsColumnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'accounts' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      const accountsResult = await client.query(accountsColumnsQuery);
      accountsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      console.log('');
    }

    // 检查 sessions 表结构
    if (tablesResult.rows.find(r => r.table_name === 'sessions')) {
      console.log('🔒 sessions 表字段:');
      const sessionsColumnsQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'sessions' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      const sessionsResult = await client.query(sessionsColumnsQuery);
      sessionsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabaseSchema().catch(console.error);
