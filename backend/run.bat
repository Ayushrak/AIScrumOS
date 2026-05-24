@echo off
echo ============================================
echo   AI ScrumOS — Backend Server Startup
echo ============================================
echo.
echo Installing Python dependencies...
pip install -r requirements.txt
echo.
echo Starting FastAPI server on http://127.0.0.1:8000
echo Docs available at http://127.0.0.1:8000/docs
echo.
python main.py
pause
