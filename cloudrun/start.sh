#!/bin/sh
# Cloud Run용 시작 스크립트

echo "🚀 Fortune AI Cloud Run 서비스 시작 중..."

# PHP-FPM 시작
echo "📦 PHP-FPM 시작 중..."
php-fpm -D

# PHP 내장 서버 시작 (백그라운드)
echo "🌐 PHP API 서버 시작 중..."
php -S 0.0.0.0:8081 -t /var/www/html/public &
PHP_PID=$!

# Next.js 서버 시작 (standalone 모드)
echo "⚡ Next.js 서버 시작 중..."
node server.js -p $PORT

# PHP 프로세스 정리
trap "kill $PHP_PID" EXIT
