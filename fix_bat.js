const fs = require('fs');
const path = require('path');

const content = `@echo off
chcp 65001 >nul
title 3D打印耗材管理系统
color 0A

echo.
echo ========================================
echo    3D打印耗材管理系统 启动中...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js 已安装

echo.
echo [2/3] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖，请稍候...
    call npm install
)
echo [OK] 依赖已就绪

echo.
echo [3/3] 启动服务器...
echo.
echo ========================================
echo    服务器启动成功！
echo    请访问: http://localhost:3001
echo ========================================
echo.
echo 按 Ctrl+C 停止服务器
echo.

node app.js
`;

const filePath = path.join(__dirname, '启动.bat');
fs.writeFileSync(filePath, content, 'utf8');
console.log('文件已成功创建');
process.exit(0);