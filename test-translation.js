// 测试中文翻译是否正确加载
const { fallbackTranslations } = require('./lib/i18n');

console.log('=== 中文翻译测试 ===');
console.log('英文原文:', fallbackTranslations.en.footer.description);
console.log('中文翻译:', fallbackTranslations.zh.footer.description);
console.log('');

// 检查所有中文翻译是否存在
const zhTranslations = fallbackTranslations.zh;
console.log('中文翻译章节数量:', Object.keys(zhTranslations).length);
console.log('包含的章节:', Object.keys(zhTranslations));

// 检查footer部分的完整翻译
console.log('');
console.log('=== Footer 中文翻译 ===');
Object.entries(zhTranslations.footer).forEach(([key, value]) => {
  if (typeof value === 'string') {
    console.log(`${key}: ${value}`);
  } else if (typeof value === 'object') {
    console.log(`${key}:`);
    Object.entries(value).forEach(([subKey, subValue]) => {
      console.log(`  ${subKey}: ${subValue}`);
    });
  }
});
