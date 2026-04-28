@echo off
REM Sobe as alteracoes (treino v4 + icones iOS) para o GitHub e grava log.
cd /d %~dp0

set LOG=push-log.txt
echo === %DATE% %TIME% === > %LOG%

echo.
echo === Marcando pasta como safe.directory para o git ===
echo === safe.directory === >> %LOG%
git config --global --add safe.directory "C:/Users/joato/Downloads/app-treino-publish" >> %LOG% 2>&1
git config --global --add safe.directory "C:/Users/joato/Downloads/app-treino-publish"

echo.
if exist .git\index.lock (
  echo Removendo .git\index.lock travado...
  echo Removendo .git\index.lock >> %LOG%
  del /f /q .git\index.lock >> %LOG% 2>&1
)

echo.
echo === git status antes ===
echo. >> %LOG%
echo === git status antes === >> %LOG%
git status >> %LOG% 2>&1
git status

echo.
echo === git add -A ===
echo. >> %LOG%
echo === git add -A === >> %LOG%
git add -A >> %LOG% 2>&1
git add -A

echo.
echo === git commit ===
echo. >> %LOG%
echo === git commit === >> %LOG%
git -c user.email=jonathanatss@gmail.com -c user.name=Jonathan commit -m "Atualiza treino v4 e adiciona suporte iOS PWA" >> %LOG% 2>&1
git -c user.email=jonathanatss@gmail.com -c user.name=Jonathan commit -m "Atualiza treino v4 e adiciona suporte iOS PWA"

echo.
echo === git push ===
echo. >> %LOG%
echo === git push === >> %LOG%
git push origin main >> %LOG% 2>&1
git push origin main

echo.
echo === Log salvo em push-log.txt ===
echo Se aparecer uma janela do GitHub pedindo login, faz o login normal.
pause
