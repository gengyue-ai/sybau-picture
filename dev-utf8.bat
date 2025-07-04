@echo off
chcp 65001 > nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { . '.\.powershell-profile.ps1'; npm run dev }"
