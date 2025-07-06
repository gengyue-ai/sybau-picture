require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

async function checkDatabaseSchema() {
  console.log('🔍 检查数据库实际表结构...')

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 查看所有表
    console.log('\n📋 检查所有表:')
    const tables = await prisma.$queryRaw`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    console.log('✅ 找到以下表:')
    tables.forEach(table => {
      console.log(`   - ${table.table_schema}.${table.table_name}`)
    })

    // 检查plans表结构（如果存在）
    try {
      console.log('\n🔧 检查plans表结构:')
      const plansColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'plans' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `

      if (plansColumns.length > 0) {
        console.log('✅ plans表存在，字段如下:')
        plansColumns.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type})`)
        })
      } else {
        console.log('❌ plans表不存在')
      }
    } catch (error) {
      console.log('❌ 无法查询plans表:', error.message)
    }

    // 检查users表结构
    try {
      console.log('\n👤 检查users表结构:')
      const usersColumns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users' AND table_schema = 'public'
        ORDER BY ordinal_position;
      `

      if (usersColumns.length > 0) {
        console.log('✅ users表存在，字段如下:')
        usersColumns.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type})`)
        })
      } else {
        console.log('❌ public.users表不存在')

        // 检查auth.users表
        console.log('\n🔍 检查auth.users表:')
        const authUsersColumns = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'users' AND table_schema = 'auth'
          ORDER BY ordinal_position;
        `

        if (authUsersColumns.length > 0) {
          console.log('✅ auth.users表存在，字段如下:')
          authUsersColumns.slice(0, 10).forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`)
          })
          console.log(`   ... 总共 ${authUsersColumns.length} 个字段`)
        }
      }
    } catch (error) {
      console.log('❌ 无法查询users表:', error.message)
    }

  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n🎯 数据库schema检查完成！')
}

checkDatabaseSchema().catch(console.error)
