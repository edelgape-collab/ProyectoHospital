@echo off
title Lanzador de Pruebas - Backend, Frontend y Cloudflare

echo Iniciando Backend (Uvicorn)...
start "1. BACKEND (Uvicorn)" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\uvicorn.exe src.main:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo Iniciando Frontend (Vite)...
start "2. FRONTEND (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando Tunel Cloudflare...
start "3. TUNEL CLOUDFLARE (Copia la URL de aqui)" cmd /k "cloudflared tunnel --url http://localhost:5173"

echo.
echo ========================================================
echo  Los 3 servidores se han abierto en ventanas separadas.
echo  Busca la URL https://....trycloudflare.com en la ventana 3.
echo ========================================================
pause
