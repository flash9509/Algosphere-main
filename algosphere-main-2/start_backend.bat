@echo off
:: Use 'py' launcher which is reliable on Windows
py -m uvicorn backend.main:app --reload
pause
