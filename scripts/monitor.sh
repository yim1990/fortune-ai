#!/bin/bash

# Fortune AI 모니터링 스크립트
echo "🔍 Fortune AI 서비스 모니터링을 시작합니다..."

# 컨테이너 상태 확인
echo "📊 컨테이너 상태:"
docker-compose ps

echo ""
echo "📈 리소스 사용량:"
docker stats --no-stream

echo ""
echo "📋 최근 로그 (마지막 20줄):"
echo "--- Nginx 로그 ---"
docker-compose logs nginx --tail=10

echo ""
echo "--- PHP 로그 ---"
docker-compose logs php --tail=10

echo ""
echo "🏥 헬스체크:"
if curl -f http://localhost/healthz > /dev/null 2>&1; then
    echo "✅ 서비스 정상"
else
    echo "❌ 서비스 이상"
fi

echo ""
echo "🧪 API 테스트:"
response=$(curl -s -X POST http://localhost/api/convert \
  -H "Content-Type: application/json" \
  -d '{"calendar":"solar","date":"1990-01-01","time":"12:00","gender":"male","name":"테스트","phone":"010-1234-5678"}')

if echo "$response" | grep -q '"ok":true'; then
    echo "✅ API 정상 작동"
else
    echo "❌ API 오류: $response"
fi

echo ""
echo "🔍 모니터링 완료!"
