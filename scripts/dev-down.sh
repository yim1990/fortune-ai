#!/usr/bin/env bash
# Fortune AI 개발환경 종료 스크립트
# Docker Compose를 사용하여 통합 개발환경을 종료합니다.

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
log_info "Fortune AI 개발환경을 종료합니다..."

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    log_error "Docker가 설치되지 않았습니다."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose가 설치되지 않았습니다."
    exit 1
fi

# 현재 실행 중인 컨테이너 확인
log_info "실행 중인 컨테이너를 확인합니다..."
if docker-compose ps --services --filter "status=running" | grep -q .; then
    log_info "다음 서비스들이 실행 중입니다:"
    docker-compose ps --services --filter "status=running"
else
    log_warning "실행 중인 서비스가 없습니다."
fi

# 컨테이너 중지 및 제거
log_info "컨테이너를 중지하고 제거합니다..."
docker-compose down -v --remove-orphans

# 네트워크 정리
log_info "사용하지 않는 네트워크를 정리합니다..."
docker network prune -f 2>/dev/null || true

# 볼륨 정리 (선택사항)
read -p "사용하지 않는 볼륨도 제거하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "사용하지 않는 볼륨을 제거합니다..."
    docker volume prune -f 2>/dev/null || true
    log_success "볼륨이 정리되었습니다."
fi

# 이미지 정리 (선택사항)
read -p "사용하지 않는 이미지도 제거하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "사용하지 않는 이미지를 제거합니다..."
    docker image prune -f 2>/dev/null || true
    log_success "이미지가 정리되었습니다."
fi

# 최종 상태 확인
log_info "최종 상태를 확인합니다..."
if docker-compose ps --services --filter "status=running" | grep -q .; then
    log_warning "일부 서비스가 여전히 실행 중입니다:"
    docker-compose ps --services --filter "status=running"
else
    log_success "모든 서비스가 성공적으로 종료되었습니다."
fi

echo ""
log_success "🎉 Fortune AI 개발환경이 성공적으로 종료되었습니다!"
echo ""
echo "📋 정리된 항목:"
echo "  • 컨테이너: 중지 및 제거 완료"
echo "  • 볼륨: 제거 완료"
echo "  • 네트워크: 정리 완료"
echo ""
echo "🔧 다시 시작하려면:"
echo "  • 개발환경 시작: ./scripts/dev-up.sh"
echo "  • 전체 재시작: ./scripts/dev-restart.sh"
echo ""
