#!/bin/bash

# Fortune AI 배포 스크립트
echo "🚀 Fortune AI 배포를 시작합니다..."

# 환경 변수 확인
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production 파일이 없습니다."
    echo "📝 .env.production.example을 복사하여 설정하세요."
    exit 1
fi

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다."
    echo "📦 Docker를 먼저 설치하세요: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되지 않았습니다."
    echo "📦 Docker Compose를 먼저 설치하세요: https://docs.docker.com/compose/install/"
    exit 1
fi

# 기존 컨테이너 정리
echo "🧹 기존 컨테이너를 정리합니다..."
docker-compose down --remove-orphans

# 이미지 빌드
echo "🔨 Docker 이미지를 빌드합니다..."
docker-compose build --no-cache

# 컨테이너 시작
echo "🚀 컨테이너를 시작합니다..."
docker-compose up -d

# 상태 확인
echo "⏳ 서비스 상태를 확인합니다..."
sleep 10

# 헬스체크
echo "🏥 헬스체크를 수행합니다..."

# Nginx 헬스체크
if curl -f http://localhost/healthz > /dev/null 2>&1; then
    echo "✅ Nginx 서비스가 정상적으로 시작되었습니다!"
else
    echo "❌ Nginx 서비스 시작에 실패했습니다."
    echo "📋 Nginx 로그를 확인하세요:"
    docker-compose logs nginx
    exit 1
fi

# PHP-FPM 헬스체크
if docker-compose exec php php -f /var/www/html/public/index.php > /dev/null 2>&1; then
    echo "✅ PHP-FPM 서비스가 정상적으로 시작되었습니다!"
else
    echo "❌ PHP-FPM 서비스 시작에 실패했습니다."
    echo "📋 PHP 로그를 확인하세요:"
    docker-compose logs php
    exit 1
fi

echo "🎉 모든 서비스가 정상적으로 시작되었습니다!"
echo "🌐 API 엔드포인트: http://localhost"
echo "🏥 헬스체크: http://localhost/healthz"
echo "📊 API 변환: http://localhost/api/convert"

# 컨테이너 상태 출력
echo "📊 컨테이너 상태:"
docker-compose ps

echo "🎉 배포가 완료되었습니다!"
