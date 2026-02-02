@echo off
echo Setup starting...
echo.

REM Create backend .env file
if not exist backend\.env (
    echo Creating backend\.env file...
    copy backend\.env.example backend\.env >nul
) else (
    echo backend\.env file already exists
)

REM Build and start Docker containers
echo Building and starting Docker containers...
docker-compose up -d --build

REM Wait for containers to start
echo Waiting for containers to start...
timeout /t 15 /nobreak >nul

REM Install Composer dependencies
echo Installing Composer dependencies...
docker-compose exec -T php composer install

REM Generate application key
echo Generating application key...
docker-compose exec -T php php artisan key:generate

REM Run database migrations
echo Running database migrations...
docker-compose exec -T php php artisan migrate --force

REM Install frontend dependencies
echo Installing frontend dependencies...
docker-compose exec -T frontend npm install

echo.
echo Setup completed!
echo.
echo Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost/api
echo.
echo View logs: docker-compose logs -f
echo Stop: docker-compose down
echo.
pause
