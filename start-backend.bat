@echo off
set PATH=D:\node.js;%PATH%
echo =====================================================================
echo  AI-Powered Smart Waste & Sanitation Management System (SIH 2026)
echo  Starting Backend API Server (Node.js / Express / PostgreSQL)...
echo =====================================================================
cd /d "%~dp0backend"
npm.cmd start
pause
