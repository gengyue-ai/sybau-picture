#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EncodingFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.logFile = path.join(this.projectRoot, 'protection/logs', `encoding-fix-${Date.now()}.log`);
    this.ensureLogDir();
  }

  ensureLogDir() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + '\n', 'utf8');
  }

  // 配置PowerShell编码
  configurePowerShell() {
    this.log('🔧 配置PowerShell编码设置...');
    
    try {
      // 创建PowerShell配置文件
      const psConfigContent = `# Sybau Picture PowerShell 编码配置
# 设置控制台输出编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

# 设置默认文件编码为UTF-8
$PSDefaultParameterValues = @{
    'Out-File:Encoding' = 'utf8'
    'Export-Csv:Encoding' = 'utf8'
    'Set-Content:Encoding' = 'utf8'
    'Add-Content:Encoding' = 'utf8'
}

# 设置环境变量
$env:PYTHONUTF8 = "1"
$env:LC_ALL = "en_US.UTF-8"

Write-Host "✅ PowerShell UTF-8 编码已配置" -ForegroundColor Green
`;

      const psProfilePath = path.join(this.projectRoot, '.powershell-profile.ps1');
      fs.writeFileSync(psProfilePath, psConfigContent, 'utf8');
      this.log('✅ PowerShell配置文件已创建: .powershell-profile.ps1');

      // 创建批处理文件来应用配置
      const batchContent = `@echo off
chcp 65001 > nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { . '.\\\.powershell-profile.ps1'; npm run dev }"
`;
      
      const batchPath = path.join(this.projectRoot, 'dev-utf8.bat');
      fs.writeFileSync(batchPath, batchContent, 'utf8');
      this.log('✅ UTF-8开发服务器启动脚本已创建: dev-utf8.bat');

    } catch (error) {
      this.log(`❌ PowerShell配置失败: ${error.message}`);
    }
  }

  // 配置Git编码
  configureGit() {
    this.log('🔧 配置Git编码设置...');
    
    try {
      const gitCommands = [
        'git config core.quotepath false',
        'git config core.autocrlf false', 
        'git config core.safecrlf false',
        'git config core.filemode false',
        'git config i18n.commitencoding utf-8',
        'git config i18n.logoutputencoding utf-8',
        'git config gui.encoding utf-8'
      ];

      gitCommands.forEach(cmd => {
        try {
          execSync(cmd, { stdio: 'pipe' });
          this.log(`✅ ${cmd}`);
        } catch (error) {
          this.log(`⚠️ Git命令失败: ${cmd} - ${error.message}`);
        }
      });

      // 创建.gitattributes文件
      const gitAttributesContent = `# Sybau Picture Git 编码配置
* text=auto eol=lf
*.js text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.css text eol=lf
*.html text eol=lf
*.svg text eol=lf
*.txt text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# 二进制文件
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary
`;

      const gitAttributesPath = path.join(this.projectRoot, '.gitattributes');
      fs.writeFileSync(gitAttributesPath, gitAttributesContent, 'utf8');
      this.log('✅ Git属性文件已创建: .gitattributes');

    } catch (error) {
      this.log(`❌ Git配置失败: ${error.message}`);
    }
  }

  // 配置VS Code/Cursor编码
  configureEditor() {
    this.log('🔧 配置编辑器编码设置...');
    
    try {
      const vscodeDir = path.join(this.projectRoot, '.vscode');
      if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir, { recursive: true });
      }

      const settingsContent = {
        "files.encoding": "utf8",
        "files.autoGuessEncoding": false,
        "files.eol": "\n",
        "editor.insertSpaces": true,
        "editor.tabSize": 2,
        "editor.detectIndentation": false,
        "files.trimTrailingWhitespace": true,
        "files.insertFinalNewline": true,
        "files.trimFinalNewlines": true,
        "typescript.preferences.quoteStyle": "single",
        "javascript.preferences.quoteStyle": "single",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit"
        },
        "terminal.integrated.defaultProfile.windows": "PowerShell",
        "terminal.integrated.profiles.windows": {
          "PowerShell": {
            "source": "PowerShell",
            "args": [
              "-NoProfile",
              "-ExecutionPolicy", "Bypass",
              "-Command", ". '.\\\.powershell-profile.ps1'"
            ]
          }
        }
      };

      const settingsPath = path.join(vscodeDir, 'settings.json');
      fs.writeFileSync(settingsPath, JSON.stringify(settingsContent, null, 2), 'utf8');
      this.log('✅ VS Code/Cursor设置已配置: .vscode/settings.json');

      // 配置任务
      const tasksContent = {
        "version": "2.0.0",
        "tasks": [
          {
            "label": "开发服务器 (UTF-8)",
            "type": "shell",
            "command": "dev-utf8.bat",
            "group": "build",
            "presentation": {
              "echo": true,
              "reveal": "always",
              "focus": false,
              "panel": "new"
            },
            "problemMatcher": []
          },
          {
            "label": "保护检查",
            "type": "shell", 
            "command": "npm",
            "args": ["run", "protect:check"],
            "group": "test"
          }
        ]
      };

      const tasksPath = path.join(vscodeDir, 'tasks.json');
      fs.writeFileSync(tasksPath, JSON.stringify(tasksContent, null, 2), 'utf8');
      this.log('✅ VS Code任务已配置: .vscode/tasks.json');

    } catch (error) {
      this.log(`❌ 编辑器配置失败: ${error.message}`);
    }
  }

  // 检查和修复文件编码
  checkAndFixFileEncoding(filePath) {
    try {
      // 读取文件内容
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 检查是否包含BOM
      const hasBOM = content.charCodeAt(0) === 0xFEFF;
      if (hasBOM) {
        const noBOMContent = content.slice(1);
        fs.writeFileSync(filePath, noBOMContent, 'utf8');
        this.log(`✅ 移除BOM: ${filePath}`);
        return true;
      }

      // 检查是否包含非UTF-8字符
      const buffer = Buffer.from(content, 'utf8');
      const decoded = buffer.toString('utf8');
      if (decoded !== content) {
        this.log(`⚠️ 编码问题: ${filePath}`);
        return false;
      }

      return true;
    } catch (error) {
      this.log(`❌ 文件编码检查失败: ${filePath} - ${error.message}`);
      return false;
    }
  }

  // 扫描和修复项目文件编码
  scanAndFixProjectFiles() {
    this.log('🔍 扫描项目文件编码...');
    
    const extensions = ['.js', '.ts', '.tsx', '.json', '.md', '.css', '.html'];
    const excludeDirs = ['node_modules', '.next', '.git', 'protection/backups'];
    
    let totalFiles = 0;
    let fixedFiles = 0;
    let errorFiles = 0;

    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(this.projectRoot, fullPath);
        
        // 跳过排除的目录
        if (excludeDirs.some(exclude => relativePath.startsWith(exclude))) {
          continue;
        }

        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(fullPath);
          if (extensions.includes(ext)) {
            totalFiles++;
            const fixed = this.checkAndFixFileEncoding(fullPath);
            if (fixed) {
              fixedFiles++;
            } else {
              errorFiles++;
            }
          }
        }
      }
    };

    scanDirectory(this.projectRoot);
    
    this.log(`📊 编码扫描完成:`);
    this.log(`   总文件数: ${totalFiles}`);
    this.log(`   修复文件数: ${fixedFiles}`);
    this.log(`   错误文件数: ${errorFiles}`);
  }

  // 主执行函数
  async fixAll() {
    this.log('🚀 开始编码修复和配置...');
    
    this.configurePowerShell();
    this.configureGit(); 
    this.configureEditor();
    this.scanAndFixProjectFiles();
    
    this.log('✅ 编码修复和配置完成!');
    this.log(`📝 详细日志: ${this.logFile}`);
    
    // 更新package.json脚本
    this.updatePackageScripts();
  }

  // 更新package.json脚本
  updatePackageScripts() {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      packageJson.scripts = {
        ...packageJson.scripts,
        'dev:utf8': 'dev-utf8.bat',
        'encoding:fix': 'node protection/scripts/encoding-fix.js',
        'encoding:check': 'node protection/scripts/encoding-fix.js check'
      };
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
      this.log('✅ package.json脚本已更新');
    } catch (error) {
      this.log(`❌ 更新package.json失败: ${error.message}`);
    }
  }
}

// 命令行入口
if (require.main === module) {
  const action = process.argv[2] || 'fix';
  const fixer = new EncodingFixer();
  
  if (action === 'check') {
    fixer.scanAndFixProjectFiles();
  } else {
    fixer.fixAll();
  }
}

module.exports = EncodingFixer; 