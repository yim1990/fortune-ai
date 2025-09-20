#!/usr/bin/env bash
# Fortune AI 개발환경 로그 확인 스크립트
# Docker Compose 서비스의 로그를 실시간으로 확인합니다.

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

# 사용법 출력
show_usage() {
    echo "사용법: $0 [서비스명] [옵션]"
    echo ""
    echo "서비스명:"
    echo "  web      - Next.js 웹 서비스 로그"
    echo "  php-api  - PHP API 서비스 로그"
    echo "  all      - 모든 서비스 로그 (기본값)"
    echo ""
    echo "옵션:"
    echo "  -f, --follow    - 실시간 로그 추적 (기본값)"
    echo "  -t, --tail N    - 마지막 N줄만 표시"
    echo "  -h, --help      - 도움말 표시"
    echo ""
    echo "예시:"
    echo "  $0                    # 모든 서비스 로그"
    echo "  $0 web                # 웹 서비스 로그만"
    echo "  $0 php-api -t 50      # PHP API 마지막 50줄"
    echo "  $0 all --follow       # 모든 서비스 실시간 로그"
}

# 기본값 설정
SERVICE="all"
FOLLOW=true
TAIL_LINES=""

# 인수 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        web|php-api|all)
            SERVICE="$1"
            shift
            ;;
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -t|--tail)
            TAIL_LINES="$2"
            FOLLOW=false
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            log_error "알 수 없는 옵션: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    log_error "Docker가 설치되지 않았습니다."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose가 설치되지 않았습니다."
    exit 1
fi

# 현재 디렉토리 확인
if [ ! -f "docker-compose.yml" ]; then
    log_error "docker-compose.yml 파일이 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

# 서비스 상태 확인
log_info "서비스 상태를 확인합니다..."
if ! docker-compose ps --services --filter "status=running" | grep -q .; then
    log_warning "실행 중인 서비스가 없습니다. 먼저 개발환경을 시작해주세요:"
    echo "  ./scripts/dev-up.sh"
    exit 1
fi

# 로그 명령어 구성
if [ "$SERVICE" = "all" ]; then
    if [ "$FOLLOW" = true ]; then
        log_info "모든 서비스의 실시간 로그를 표시합니다..."
        log_info "종료하려면 Ctrl+C를 누르세요."
        echo ""
        docker-compose logs -f
    else
        if [ -n "$TAIL_LINES" ]; then
            log_info "모든 서비스의 마지막 $TAIL_LINES줄을 표시합니다..."
            docker-compose logs --tail="$TAIL_LINES"
        else
            log_info "모든 서비스의 로그를 표시합니다..."
            docker-compose logs
        fi
    fi
else
    # 특정 서비스 로그
    if [ "$FOLLOW" = true ]; then
        log_info "$SERVICE 서비스의 실시간 로그를 표시합니다..."
        log_info "종료하려면 Ctrl+C를 누르세요."
        echo ""
        docker-compose logs -f "$SERVICE"
    else
        if [ -n "$TAIL_LINES" ]; then
            log_info "$SERVICE 서비스의 마지막 $TAIL_LINES줄을 표시합니다..."
            docker-compose logs --tail="$TAIL_LINES" "$SERVICE"
        else
            log_info "$SERVICE 서비스의 로그를 표시합니다..."
            docker-compose logs "$SERVICE"
        fi
    fi
fi
