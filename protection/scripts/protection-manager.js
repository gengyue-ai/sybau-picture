const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 导入保护模块
const { saveChecksums, verifyIntegrity } = require('./file-integrity-check');
const { backupProtectedFiles, cleanupOldBackups } = require('./backup-system');
const { runPreBuildCheck } = require('./pre-build-check');

// 保护配置
const PROTECTION_CONFIG = {
  autoBackup: true,
  autoIntegrityCheck: true,
  preBuildValidation: true,
  watchFiles: true,
  logLevel: 'info', // debug, info, warn, error
  notifications: {
    enabled: true,
    channels: ['console', 'file'] // console, file, email (未实现)
  }
};

// 日志系统
class Logger {
  constructor(logLevel = 'info') {
    this.logLevel = logLevel;
    this.logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.logDir = 'protection/logs';
    
    // 确保日志目录存在
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  shouldLog(level) {
    return this.logLevels[level] >= this.logLevels[this.logLevel];
  }
  
  log(level, message, data = null) {
    if (!this.shouldLog(level)) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data
    };
    
    // 控制台输出
    if (PROTECTION_CONFIG.notifications.channels.includes('console')) {
      const emoji = { debug: '🐛', info: 'ℹ️', warn: '⚠️', error: '❌' };
      console.log(`${emoji[level]} [${timestamp}] ${message}`);
      if (data) {
        console.log('   数据:', JSON.stringify(data, null, 2));
      }
    }
    
    // 文件输出
    if (PROTECTION_CONFIG.notifications.channels.includes('file')) {
      const logFile = path.join(this.logDir, `protection-${new Date().toISOString().split('T')[0]}.log`);
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(logFile, logLine);
    }
  }
  
  debug(message, data) { this.log('debug', message, data); }
  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
}

const logger = new Logger(PROTECTION_CONFIG.logLevel);

// 保护状态管理
class ProtectionState {
  constructor() {
    this.stateFile = 'protection/protection-state.json';
    this.state = this.loadState();
  }
  
  loadState() {
    try {
      if (fs.existsSync(this.stateFile)) {
        return JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      }
    } catch (error) {
      logger.warn('加载保护状态失败，使用默认状态', { error: error.message });
    }
    
    return {
      lastBackup: null,
      lastIntegrityCheck: null,
      lastBuild: null,
      protectionEnabled: true,
      checksumsSaved: false,
      watcherActive: false
    };
  }
  
  saveState() {
    try {
      const dir = path.dirname(this.stateFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
      logger.debug('保护状态已保存');
    } catch (error) {
      logger.error('保存保护状态失败', { error: error.message });
    }
  }
  
  updateState(updates) {
    Object.assign(this.state, updates);
    this.saveState();
  }
  
  getState() {
    return { ...this.state };
  }
}

const protectionState = new ProtectionState();

// 初始化保护系统
function initializeProtection() {
  logger.info('🛡️ 初始化保护系统...');
  
  try {
    // 创建必要的目录
    const dirs = [
      'protection/scripts',
      'protection/backups', 
      'protection/logs',
      'protection/checksums'
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.debug(`创建目录: ${dir}`);
      }
    });
    
    // 检查是否已有校验和
    if (!protectionState.state.checksumsSaved) {
      logger.info('首次运行，生成文件校验和...');
      saveChecksums();
      protectionState.updateState({ 
        checksumsSaved: true,
        lastIntegrityCheck: new Date().toISOString()
      });
    }
    
    // 执行初始完整性检查
    const integrityResult = verifyIntegrity();
    if (!integrityResult.success) {
      logger.warn('发现文件完整性问题', { issues: integrityResult.issues });
    }
    
    // 创建初始备份
    if (PROTECTION_CONFIG.autoBackup && !protectionState.state.lastBackup) {
      logger.info('创建初始备份...');
      backupProtectedFiles();
      protectionState.updateState({ lastBackup: new Date().toISOString() });
    }
    
    protectionState.updateState({ protectionEnabled: true });
    logger.info('✅ 保护系统初始化完成');
    
    return { success: true };
  } catch (error) {
    logger.error('保护系统初始化失败', { error: error.message });
    return { success: false, error: error.message };
  }
}

// 执行完整的保护检查
function runFullProtectionCheck() {
  logger.info('🔍 执行完整保护检查...');
  
  const results = {
    timestamp: new Date().toISOString(),
    success: true,
    checks: {}
  };
  
  try {
    // 1. 完整性检查
    logger.info('检查文件完整性...');
    const integrityResult = verifyIntegrity();
    results.checks.integrity = integrityResult;
    
    if (!integrityResult.success) {
      results.success = false;
      logger.warn('文件完整性检查失败', { issues: integrityResult.issues });
    } else {
      logger.info('✅ 文件完整性检查通过');
    }
    
    // 2. 构建前检查
    if (PROTECTION_CONFIG.preBuildValidation) {
      logger.info('执行构建前验证...');
      const buildCheckResult = runPreBuildCheck();
      results.checks.preBuild = buildCheckResult;
      
      if (!buildCheckResult.success) {
        results.success = false;
        logger.warn('构建前检查失败', { issues: buildCheckResult.issues });
      } else {
        logger.info('✅ 构建前检查通过');
      }
    }
    
    // 3. 备份状态检查
    if (PROTECTION_CONFIG.autoBackup) {
      const lastBackup = protectionState.state.lastBackup;
      if (lastBackup) {
        const backupAge = Date.now() - new Date(lastBackup).getTime();
        const hoursAge = backupAge / (1000 * 60 * 60);
        
        if (hoursAge > 24) {
          logger.info('备份已过期，创建新备份...');
          backupProtectedFiles();
          protectionState.updateState({ lastBackup: new Date().toISOString() });
        } else {
          logger.info(`✅ 备份状态正常 (${hoursAge.toFixed(1)} 小时前)`);
        }
      } else {
        logger.info('创建首次备份...');
        backupProtectedFiles();
        protectionState.updateState({ lastBackup: new Date().toISOString() });
      }
    }
    
    // 更新状态
    protectionState.updateState({ 
      lastIntegrityCheck: new Date().toISOString() 
    });
    
    // 生成报告
    const reportPath = `protection/logs/protection-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    logger.info(`检查报告已保存: ${reportPath}`);
    
    if (results.success) {
      logger.info('🎉 所有保护检查通过！');
    } else {
      logger.error('❌ 保护检查发现问题，请查看详细报告');
    }
    
    return results;
  } catch (error) {
    logger.error('保护检查执行失败', { error: error.message });
    return { success: false, error: error.message };
  }
}

// 安全构建
function safeBuild() {
  logger.info('🚀 开始安全构建流程...');
  
  try {
    // 1. 执行完整保护检查
    const checkResult = runFullProtectionCheck();
    if (!checkResult.success) {
      logger.error('保护检查失败，停止构建');
      return { success: false, reason: 'protection_check_failed' };
    }
    
    // 2. 创建构建前备份
    logger.info('创建构建前备份...');
    backupProtectedFiles();
    
    // 3. 执行构建
    logger.info('执行 Next.js 构建...');
    const buildOutput = execSync('npm run build', { 
      encoding: 'utf8',
      timeout: 300000 // 5分钟超时
    });
    
    logger.info('✅ 构建成功完成');
    protectionState.updateState({ lastBuild: new Date().toISOString() });
    
    return { 
      success: true, 
      buildOutput,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('构建失败', { error: error.message });
    return { 
      success: false, 
      error: error.message,
      reason: 'build_failed'
    };
  }
}

// 清理和维护
function performMaintenance() {
  logger.info('🧹 执行保护系统维护...');
  
  try {
    // 清理旧备份
    cleanupOldBackups();
    
    // 清理旧日志（保留30天）
    const logDir = 'protection/logs';
    if (fs.existsSync(logDir)) {
      const files = fs.readdirSync(logDir);
      const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30天
      
      files.forEach(file => {
        const filePath = path.join(logDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          logger.debug(`删除旧日志: ${file}`);
        }
      });
    }
    
    logger.info('✅ 维护完成');
    return { success: true };
  } catch (error) {
    logger.error('维护失败', { error: error.message });
    return { success: false, error: error.message };
  }
}

// 获取保护状态报告
function getProtectionStatus() {
  const state = protectionState.getState();
  const report = {
    timestamp: new Date().toISOString(),
    protectionEnabled: state.protectionEnabled,
    lastBackup: state.lastBackup,
    lastIntegrityCheck: state.lastIntegrityCheck,
    lastBuild: state.lastBuild,
    systemHealth: 'good' // good, warning, critical
  };
  
  // 评估系统健康状况
  const now = Date.now();
  
  if (state.lastBackup) {
    const backupAge = now - new Date(state.lastBackup).getTime();
    if (backupAge > 7 * 24 * 60 * 60 * 1000) { // 7天
      report.systemHealth = 'warning';
      report.warnings = report.warnings || [];
      report.warnings.push('备份过期超过7天');
    }
  } else {
    report.systemHealth = 'critical';
    report.errors = report.errors || [];
    report.errors.push('从未创建备份');
  }
  
  if (state.lastIntegrityCheck) {
    const checkAge = now - new Date(state.lastIntegrityCheck).getTime();
    if (checkAge > 24 * 60 * 60 * 1000) { // 24小时
      report.systemHealth = report.systemHealth === 'critical' ? 'critical' : 'warning';
      report.warnings = report.warnings || [];
      report.warnings.push('完整性检查过期超过24小时');
    }
  }
  
  return report;
}

// 主执行逻辑
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      initializeProtection();
      break;
    case 'check':
      const result = runFullProtectionCheck();
      process.exit(result.success ? 0 : 1);
      break;
    case 'build':
      const buildResult = safeBuild();
      process.exit(buildResult.success ? 0 : 1);
      break;
    case 'status':
      const status = getProtectionStatus();
      console.log('📊 保护系统状态:');
      console.log(JSON.stringify(status, null, 2));
      break;
    case 'maintenance':
      performMaintenance();
      break;
    case 'enable':
      protectionState.updateState({ protectionEnabled: true });
      logger.info('✅ 保护系统已启用');
      break;
    case 'disable':
      protectionState.updateState({ protectionEnabled: false });
      logger.warn('⚠️ 保护系统已禁用');
      break;
    default:
      console.log('🛡️ Sybau Picture 保护系统');
      console.log('用法:');
      console.log('  node protection-manager.js init         - 初始化保护系统');
      console.log('  node protection-manager.js check        - 执行完整保护检查');
      console.log('  node protection-manager.js build        - 安全构建');
      console.log('  node protection-manager.js status       - 查看保护状态');
      console.log('  node protection-manager.js maintenance  - 执行维护');
      console.log('  node protection-manager.js enable       - 启用保护');
      console.log('  node protection-manager.js disable      - 禁用保护');
  }
}

module.exports = {
  initializeProtection,
  runFullProtectionCheck,
  safeBuild,
  performMaintenance,
  getProtectionStatus,
  Logger,
  ProtectionState
}; 