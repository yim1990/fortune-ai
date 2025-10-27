#!/bin/sh
# Cloud Run용 시작 스크립트

echo "🚀 Fortune AI Cloud Run 서비스 시작 중..."

# PEAR 패키지 경로 확인
PEAR_DIR=$(pear config-get php_dir 2>/dev/null || echo "/usr/local/lib/php")
echo "📦 PEAR 디렉토리: $PEAR_DIR"

# PHP include_path 설정
export PHP_INCLUDE_PATH=".:$PEAR_DIR:/usr/local/lib/php:/usr/share/php"
echo "📂 PHP include_path: $PHP_INCLUDE_PATH"

# PHP-FPM 시작
echo "📦 PHP-FPM 시작 중..."
php-fpm -D

# PHP 내장 서버 시작 (include_path 명시적 설정)
echo "🌐 PHP API 서버 시작 중..."
php -d include_path="$PHP_INCLUDE_PATH" -S 0.0.0.0:8081 -t /var/www/html/public &
PHP_PID=$!

# Next.js 서버 시작 (standalone 모드)
echo "⚡ Next.js 서버 시작 중..."
node server.js -p $PORT

# PHP 프로세스 정리
trap "kill $PHP_PID" EXIT
