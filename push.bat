@echo off
REM Sobe alteracoes para o GitHub. Duplo clique para rodar.
cd /d %~dp0

set LOG=push-log.txt
echo === %DATE% %TIME% === > %LOG%

echo === safe.directory === >> %LOG%
git config --global --add safe.directory "C:/Users/joato/Downloads/app-treino-publish" >> %LOG% 2>&1
git config --global --add safe.directory "C:/Users/joato/Downloads/app-treino-publish"

if exist .git\index.lock (
  echo Removendo .git\index.lock travado...
  del /f /q .git\index.lock >> %LOG% 2>&1
)

echo. >> %LOG%
echo === git status === >> %LOG%
git status >> %LOG% 2>&1
git status

echo. >> %LOG%
echo === git add === >> %LOG%
git add -A >> %LOG% 2>&1
git add -A

echo. >> %LOG%
echo === git commit === >> %LOG%
git -c user.email=jonathanatss@gmail.com -c user.name=Jonathan commit -m "Adiciona login com PIN e perfil da Sara (Full Body 3x + opcional)" >> %LOG% 2>&1
git -c user.email=jonathanatss@gmail.com -c user.name=Jonathan commit -m "Adiciona login com PIN e perfil da Sara (Full Body 3x + opcional)"

echo. >> %LOG%
echo === git push === >> %LOG%
git push origin main >> %LOG% 2>&1
git push origin main

echo.
echo === Log salvo em push-log.txt ===
echo Pronto. Netlify republica em ~30s.
pause
