#!/usr/bin/env bash
# Fortune AI 개발환경 재시작 스크립트
# 개발환경을 완전히 종료한 후 다시 시작합니다.

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
log_info "Fortune AI 개발환경을 재시작합니다..."

# 현재 디렉토리 확인
if [ ! -f "docker-compose.yml" ]; then
    log_error "docker-compose.yml 파일이 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

# 1단계: 기존 환경 종료
log_info "1단계: 기존 개발환경을 종료합니다..."
if [ -f "scripts/dev-down.sh" ]; then
    ./scripts/dev-down.sh
else
    log_warning "dev-down.sh 스크립트를 찾을 수 없습니다. 직접 종료합니다..."
    docker-compose down -v --remove-orphans
fi

# 2단계: 잠시 대기
log_info "2단계: 시스템 정리를 위해 잠시 대기합니다..."
sleep 3

# 3단계: 새 환경 시작
log_info "3단계: 새로운 개발환경을 시작합니다..."
if [ -f "scripts/dev-up.sh" ]; then
    ./scripts/dev-up.sh
else
    log_warning "dev-up.sh 스크립트를 찾을 수 없습니다. 직접 시작합니다..."
    docker-compose up -d --build
fi

echo ""
log_success "🎉 Fortune AI 개발환경 재시작이 완료되었습니다!"
echo ""
