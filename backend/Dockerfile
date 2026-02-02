FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create storage directories
RUN mkdir -p storage/framework/{sessions,views,cache} storage/logs \
    && chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Create necessary directories
RUN mkdir -p /app/storage/framework/{sessions,views,cache,testing} \
    && mkdir -p /app/storage/logs \
    && chmod -R 775 /app/storage \
    && chmod -R 775 /app/bootstrap/cache

# Set default port
ENV PORT=8000

# Create a startup script that waits for database
RUN echo '#!/bin/sh\n\
echo "=== Database Configuration ==="\n\
echo "DB_HOST: $DB_HOST"\n\
echo "DB_PORT: $DB_PORT"\n\
echo "DB_DATABASE: $DB_DATABASE"\n\
echo "DB_USERNAME: $DB_USERNAME"\n\
echo "=============================="\n\
echo "Waiting for database connection..."\n\
MAX_RETRIES=30\n\
RETRY_COUNT=0\n\
until php artisan migrate --force 2>&1 || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do\n\
  RETRY_COUNT=$((RETRY_COUNT + 1))\n\
  echo "Attempt $RETRY_COUNT/$MAX_RETRIES: Database not ready, waiting..."\n\
  sleep 3\n\
done\n\
if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then\n\
  echo "ERROR: Could not connect to database after $MAX_RETRIES attempts"\n\
  exit 1\n\
fi\n\
echo "Database connected, starting server..."\n\
php artisan serve --host=0.0.0.0 --port=${PORT}' > /start.sh \
    && chmod +x /start.sh

# Start the application
CMD ["/start.sh"]
