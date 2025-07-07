@echo off
echo 🚀 Starting Backend...

start "Backend Server" cmd /k "cd backend && python app.py"

timeout /t 25 > nul
echo ✅ Backend started. Now launching Frontend...

start "Frontend App" cmd /k "cd frontend && npx expo start --clear"
