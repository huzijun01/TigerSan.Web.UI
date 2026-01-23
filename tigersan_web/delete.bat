@echo off
setlocal enabledelayedexpansion

rem 检查当前目录下是否存在名为 “node_modules” 的文件夹
if exist "node_modules" (
  echo Deleting "node_modules"
  rmdir /s /q "node_modules"
)

rem 检查当前目录下是否存在名为 “dist” 的文件夹
if exist "dist" (
  echo Deleting "dist"
  rmdir /s /q "dist"
)

endlocal

pause
