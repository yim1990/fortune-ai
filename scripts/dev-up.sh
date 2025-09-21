#!/usr/bin/env bash
# Fortune AI 개발환경 시작 스크립트
# Docker Compose를 사용하여 통합 개발환경을 시작합니다.

set -euo pipefail

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 스크립트 시작
log_info "Fortune AI 개발환경을 시작합니다..."

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    log_error "Docker가 설치되지 않았습니다. Docker를 먼저 설치해주세요."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose가 설치되지 않았습니다. Docker Compose를 먼저 설치해주세요."
    exit 1
fi

# 환경변수 파일 확인
if [ ! -f ".env.development" ]; then
    log_warning ".env.development 파일이 없습니다. .env.example을 복사하여 생성합니다..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.development
        log_success ".env.development 파일이 생성되었습니다. 필요한 값들을 수정해주세요."
    else
        log_error ".env.example 파일이 없습니다."
        exit 1
    fi
fi

# 환경변수 파일이 최신인지 확인
if [ -f ".env.development" ] && [ -f ".env.example" ]; then
    if [ ".env.development" -ot ".env.example" ]; then
        log_warning ".env.development 파일이 .env.example보다 오래되었습니다."
        log_info "최신 설정을 적용하려면 .env.example을 참고하여 .env.development를 업데이트하세요."
    fi
fi

# 기존 컨테이너 정리
log_info "기존 컨테이너를 정리합니다..."
docker-compose down --remove-orphans 2>/dev/null || true

# 이미지 빌드 및 컨테이너 시작
log_info "Docker 이미지를 빌드하고 컨테이너를 시작합니다..."
docker-compose up -d --build

# 컨테이너 상태 확인
log_info "컨테이너 상태를 확인합니다..."
sleep 5

# 컨테이너 상태 출력
docker-compose ps

# 헬스체크
log_info "서비스 헬스체크를 수행합니다..."

# PHP API 헬스체크 (Docker 컨테이너 내부 포트)
if curl -s http://localhost:8080/healthz > /dev/null 2>&1; then
    log_success "PHP API 서비스가 정상적으로 작동 중입니다."
else
    log_warning "PHP API 서비스에 연결할 수 없습니다. (포트 8080)"
    log_info "Docker 컨테이너 내부에서만 접근 가능합니다. 웹 서비스를 통해 테스트하세요."
fi

# Next.js 웹 서비스 헬스체크
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    log_success "Next.js 웹 서비스가 정상적으로 작동 중입니다."
else
    log_warning "Next.js 웹 서비스에 연결할 수 없습니다. (포트 3000)"
fi

# API 테스트
log_info "API 엔드포인트를 테스트합니다..."
if curl -s -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"calendar":"solar","date":"1990-01-01","time":"14:30","gender":"female","name":"테스트","phone":"010-1234-5678"}' \
  > /dev/null 2>&1; then
    log_success "API 변환 엔드포인트가 정상적으로 작동 중입니다."
else
    log_warning "API 변환 엔드포인트에 연결할 수 없습니다."
fi

echo ""
log_success "🎉 Fortune AI 개발환경이 성공적으로 시작되었습니다!"
echo ""
echo "📋 서비스 접근 정보:"
echo "  • Next.js 웹 애플리케이션: http://localhost:3000"
echo "  • API 테스트 페이지: http://localhost:3000/test-api"
echo "  • PHP API 서비스: Docker 컨테이너 내부 (포트 8080)"
echo "  • 환경변수 파일: .env.development (자동 로드됨)"
echo ""
echo "🔧 유용한 명령어:"
echo "  • 컨테이너 상태 확인: docker-compose ps"
echo "  • 로그 확인: docker-compose logs -f [service-name]"
echo "  • 개발환경 종료: ./scripts/dev-down.sh"
echo "  • 전체 재시작: ./scripts/dev-restart.sh"
echo "  • 환경변수 테스트: curl http://localhost:3000/api/test-env"
echo ""
echo "📝 환경변수 관리:"
echo "  • 개발용: .env.development 파일 수정"
echo "  • 프로덕션용: .env.production 파일 수정"
echo "  • 예시 파일: .env.example 참고"
echo ""
