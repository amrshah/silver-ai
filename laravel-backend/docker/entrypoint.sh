#!/bin/bash

if [ ! -f "vendor/autoload.php" ]; then
    composer install --no-progress --no-interaction
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file for env $APP_ENV"
    cp .env.example .env
    php artisan key:generate
else
    echo ".env file exists"
fi

if [ ! -f "database/database.sqlite" ]; then
    echo "Creating database/database.sqlite"
    touch database/database.sqlite
fi

php artisan migrate:status > /dev/null 2>&1
status=$?

if [ $status -ne 0 ]; then
  echo "Migrations table not found or error accessing DB. attempting to migrate..."
  php artisan migrate --force
  php artisan db:seed --force
fi

php-fpm
