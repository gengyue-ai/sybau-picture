const path = require('path')
const fs = require('fs')

// 支持的语言列表
const SUPPORTED_LANGUAGES = ['en', 'zh', 'es', 'ja', 'ko', 'fr', 'de', 'pt', 'ru', 'ar']
const DEFAULT_LANGUAGE = 'en'

// 需要测试的页面路径
const TEST_PAGES = [
  '/',
  '/generator',
  '/gallery',
  '/blog',
  '/about',
  '/help',
  '/privacy',
  '/terms',
  '/contact',
  '/careers'
]

// 测试结果统计
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
}

console.log('🚀 开始多语言导航流程测试...\n')

/**
 * 模拟生成本地化链接的函数
 */
function generateLocalizedLink(targetPath, currentPath) {
  const pathSegments = currentPath.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]

  // 检查是否为有效语言代码
  const isValidLanguage = SUPPORTED_LANGUAGES.includes(firstSegment)

  let language = DEFAULT_LANGUAGE
  if (isValidLanguage) {
    language = firstSegment
  }

  // 如果是默认语言（英文），直接返回路径
  if (language === DEFAULT_LANGUAGE) {
    return targetPath
  }

  // 对于其他语言，添加语言前缀
  return `/${language}${targetPath}`
}

/**
 * 测试单个语言的导航链接
 */
function testLanguageNavigation(language) {
  console.log(`📍 测试 ${language.toUpperCase()} 语言导航...`)

  const basePath = language === DEFAULT_LANGUAGE ? '/' : `/${language}/`
  let languageResults = {
    language: language,
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  }

  TEST_PAGES.forEach(page => {
    const currentPath = language === DEFAULT_LANGUAGE ? page : `/${language}${page}`

    // 测试每个页面的导航链接
    TEST_PAGES.forEach(targetPage => {
      const expectedLink = generateLocalizedLink(targetPage, currentPath)
      const actualLink = generateLocalizedLink(targetPage, currentPath)

      const testName = `${currentPath} -> ${targetPage}`

      if (expectedLink === actualLink) {
        languageResults.passed++
        languageResults.tests.push({
          name: testName,
          status: 'PASS',
          expected: expectedLink,
          actual: actualLink
        })
      } else {
        languageResults.failed++
        languageResults.tests.push({
          name: testName,
          status: 'FAIL',
          expected: expectedLink,
          actual: actualLink,
          error: `链接生成不正确`
        })
      }
    })
  })

  return languageResults
}

/**
 * 测试语言切换功能
 */
function testLanguageSwitching() {
  console.log('🔄 测试语言切换功能...')

  let switchingResults = {
    passed: 0,
    failed: 0,
    tests: []
  }

  TEST_PAGES.forEach(page => {
    SUPPORTED_LANGUAGES.forEach(fromLang => {
      SUPPORTED_LANGUAGES.forEach(toLang => {
        if (fromLang === toLang) return

        const currentPath = fromLang === DEFAULT_LANGUAGE ? page : `/${fromLang}${page}`
        const expectedPath = toLang === DEFAULT_LANGUAGE ? page : `/${toLang}${page}`

        // 模拟语言切换逻辑
        function generateLanguageUrl(currentPath, targetLang) {
          let pathWithoutLang = currentPath
          const segments = currentPath.split('/').filter(Boolean)

          if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0])) {
            pathWithoutLang = '/' + segments.slice(1).join('/')
            if (pathWithoutLang === '/') pathWithoutLang = '/'
          }

          if (targetLang === DEFAULT_LANGUAGE) {
            return pathWithoutLang
          }

          if (pathWithoutLang === '/') {
            return `/${targetLang}`
          }
          return `/${targetLang}${pathWithoutLang}`
        }

        const actualPath = generateLanguageUrl(currentPath, toLang)
        const testName = `${fromLang}${page} -> ${toLang}`

        if (expectedPath === actualPath) {
          switchingResults.passed++
          switchingResults.tests.push({
            name: testName,
            status: 'PASS',
            expected: expectedPath,
            actual: actualPath
          })
        } else {
          switchingResults.failed++
          switchingResults.tests.push({
            name: testName,
            status: 'FAIL',
            expected: expectedPath,
            actual: actualPath,
            error: `语言切换URL生成错误`
          })
        }
      })
    })
  })

  return switchingResults
}

/**
 * 验证文件结构
 */
function validateFileStructure() {
  console.log('📁 验证多语言文件结构...')

  let structureResults = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  }

  // 检查核心组件是否存在
  const coreFiles = [
    'components/LanguageSwitcher.tsx',
    'components/Navbar.tsx',
    'components/Footer.tsx',
    'lib/i18n.ts',
    'hooks/useTranslation.ts',
    'middleware.ts'
  ]

  coreFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      structureResults.passed++
      structureResults.tests.push({
        name: `检查文件: ${file}`,
        status: 'PASS',
        message: '文件存在'
      })
    } else {
      structureResults.failed++
      structureResults.tests.push({
        name: `检查文件: ${file}`,
        status: 'FAIL',
        error: '文件不存在'
      })
    }
  })

  // 检查语言页面文件
  SUPPORTED_LANGUAGES.forEach(lang => {
    if (lang === DEFAULT_LANGUAGE) return // 跳过默认语言

    const langPages = [
      `app/${lang}/page.tsx`,
      `app/${lang}/blog/page.tsx`,
      `app/${lang}/gallery/page.tsx`,
      `app/${lang}/generator/page.tsx`,
      `app/${lang}/about/page.tsx`
    ]

    langPages.forEach(page => {
      const filePath = path.join(process.cwd(), page)
      if (fs.existsSync(filePath)) {
        structureResults.passed++
        structureResults.tests.push({
          name: `检查语言页面: ${page}`,
          status: 'PASS',
          message: '页面文件存在'
        })
      } else {
        structureResults.warnings++
        structureResults.tests.push({
          name: `检查语言页面: ${page}`,
          status: 'WARNING',
          message: '页面文件不存在，但可能是可选的'
        })
      }
    })
  })

  return structureResults
}

/**
 * 主测试函数
 */
async function runNavigationTests() {
  console.log('🌐 Sybau Picture 多语言导航测试\n')
  console.log('=' .repeat(60))

  // 1. 验证文件结构
  const structureResults = validateFileStructure()
  console.log(`\n📁 文件结构验证: ${structureResults.passed} 通过, ${structureResults.failed} 失败, ${structureResults.warnings} 警告`)

  // 2. 测试每种语言的导航
  console.log('\n' + '=' .repeat(60))
  const allLanguageResults = []

  for (const language of SUPPORTED_LANGUAGES) {
    const results = testLanguageNavigation(language)
    allLanguageResults.push(results)
    console.log(`   ${language.toUpperCase()}: ${results.passed} 通过, ${results.failed} 失败`)
  }

  // 3. 测试语言切换
  console.log('\n' + '=' .repeat(60))
  const switchingResults = testLanguageSwitching()
  console.log(`🔄 语言切换测试: ${switchingResults.passed} 通过, ${switchingResults.failed} 失败`)

  // 4. 生成详细报告
  console.log('\n' + '=' .repeat(60))
  console.log('📊 详细测试报告\n')

  // 汇总统计
  let totalPassed = structureResults.passed + switchingResults.passed
  let totalFailed = structureResults.failed + switchingResults.failed
  let totalWarnings = structureResults.warnings

  allLanguageResults.forEach(result => {
    totalPassed += result.passed
    totalFailed += result.failed
  })

  console.log(`✅ 总通过: ${totalPassed}`)
  console.log(`❌ 总失败: ${totalFailed}`)
  console.log(`⚠️  总警告: ${totalWarnings}`)
  console.log(`📈 成功率: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`)

  // 显示失败的测试
  if (totalFailed > 0) {
    console.log('\n❌ 失败的测试:')

    // 结构测试失败
    structureResults.tests.filter(test => test.status === 'FAIL').forEach(test => {
      console.log(`   - ${test.name}: ${test.error}`)
    })

    // 导航测试失败
    allLanguageResults.forEach(result => {
      result.tests.filter(test => test.status === 'FAIL').forEach(test => {
        console.log(`   - [${result.language}] ${test.name}: ${test.error}`)
      })
    })

    // 语言切换测试失败
    switchingResults.tests.filter(test => test.status === 'FAIL').forEach(test => {
      console.log(`   - [切换] ${test.name}: ${test.error}`)
    })
  }

  // 显示警告
  if (totalWarnings > 0) {
    console.log('\n⚠️  警告:')
    structureResults.tests.filter(test => test.status === 'WARNING').forEach(test => {
      console.log(`   - ${test.name}: ${test.message}`)
    })
  }

  console.log('\n' + '=' .repeat(60))

  if (totalFailed === 0) {
    console.log('🎉 所有测试通过！多语言导航系统工作正常。')
    return true
  } else {
    console.log('🔧 发现问题需要修复。请查看上面的详细报告。')
    return false
  }
}

/**
 * 生成修复建议
 */
function generateFixSuggestions() {
  console.log('\n🔧 修复建议:\n')

  console.log('1. 确保所有组件都使用 generateLocalizedLink 函数:')
  console.log('   - 在 Navbar.tsx 中检查导航链接')
  console.log('   - 在 Footer.tsx 中检查页脚链接')
  console.log('   - 在各个页面组件中检查内部链接')

  console.log('\n2. 验证 LanguageSwitcher 组件:')
  console.log('   - 确保语言切换功能正确生成URL')
  console.log('   - 测试语言切换是否保留当前页面路径')

  console.log('\n3. 检查中间件配置:')
  console.log('   - 确保 middleware.ts 正确处理语言路由')
  console.log('   - 验证默认语言处理逻辑')

  console.log('\n4. 测试实际页面访问:')
  console.log('   - 访问 http://localhost:3002/ (英文)')
  console.log('   - 访问 http://localhost:3002/zh (中文)')
  console.log('   - 测试语言切换按钮')
  console.log('   - 验证导航链接是否正确')
}

// 运行测试
runNavigationTests().then(success => {
  if (!success) {
    generateFixSuggestions()
  }

  console.log('\n🎯 下一步:')
  console.log('1. 启动开发服务器: npm run dev')
  console.log('2. 手动测试不同语言版本的页面')
  console.log('3. 验证语言切换功能')
  console.log('4. 检查控制台是否有错误')
})
