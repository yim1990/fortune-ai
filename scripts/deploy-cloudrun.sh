#!/usr/bin/env bash
# Fortune AI Cloud Run 배포 스크립트

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

# 기본 설정
PROJECT_ID="fortune-ai-project"
SERVICE_NAME="fortune-ai"
REGION="asia-northeast1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# 스크립트 시작
log_info "Fortune AI Cloud Run 배포를 시작합니다..."

# 1. GCP 프로젝트 설정 확인
log_info "GCP 프로젝트 설정을 확인합니다..."
if ! gcloud config get-value project > /dev/null 2>&1; then
    log_error "GCP 프로젝트가 설정되지 않았습니다."
    log_info "다음 명령어로 프로젝트를 설정하세요:"
    echo "gcloud config set project ${PROJECT_ID}"
    exit 1
fi

CURRENT_PROJECT=$(gcloud config get-value project)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    log_warning "현재 프로젝트: $CURRENT_PROJECT"
    log_info "프로젝트를 ${PROJECT_ID}로 변경합니다..."
    gcloud config set project $PROJECT_ID
fi

# 2. 필요한 API 활성화
log_info "필요한 GCP API를 활성화합니다..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 3. Docker 데몬 확인 및 시작
log_info "Docker 데몬 상태를 확인합니다..."
if ! docker info > /dev/null 2>&1; then
    log_warning "Docker 데몬이 실행되지 않았습니다. Docker를 시작합니다..."
    
    # macOS에서 Docker Desktop 시작
    if [[ "$OSTYPE" == "darwin"* ]]; then
        log_info "macOS에서 Docker Desktop을 시작합니다..."
        open -a Docker
        
        # Docker가 시작될 때까지 대기
        log_info "Docker가 시작될 때까지 대기합니다..."
        max_attempts=30
        attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if docker info > /dev/null 2>&1; then
                log_success "Docker가 성공적으로 시작되었습니다!"
                break
            fi
            
            log_info "Docker 시작 대기 중... ($attempt/$max_attempts)"
            sleep 2
            ((attempt++))
        done
        
        if [ $attempt -gt $max_attempts ]; then
            log_error "Docker 시작에 실패했습니다. Docker Desktop을 수동으로 시작해주세요."
            exit 1
        fi
    else
        # Linux에서 Docker 서비스 시작
        log_info "Linux에서 Docker 서비스를 시작합니다..."
        sudo systemctl start docker
        
        # Docker가 시작될 때까지 대기
        max_attempts=15
        attempt=1
        
        while [ $attempt -le $max_attempts ]; do
            if docker info > /dev/null 2>&1; then
                log_success "Docker가 성공적으로 시작되었습니다!"
                break
            fi
            
            log_info "Docker 시작 대기 중... ($attempt/$max_attempts)"
            sleep 2
            ((attempt++))
        done
        
        if [ $attempt -gt $max_attempts ]; then
            log_error "Docker 시작에 실패했습니다. Docker 서비스를 수동으로 시작해주세요."
            exit 1
        fi
    fi
else
    log_success "Docker가 이미 실행 중입니다."
fi

# 4. Docker 이미지 빌드 (AMD64 아키텍처로 빌드)
log_info "Docker 이미지를 빌드합니다 (AMD64 아키텍처)..."
docker build --platform linux/amd64 -f Dockerfile.cloudrun -t ${IMAGE_NAME}:latest .

# 5. Google Container Registry에 푸시
log_info "Google Container Registry에 이미지를 푸시합니다..."
docker push ${IMAGE_NAME}:latest

# 6. Cloud Run 서비스 배포
log_info "Cloud Run 서비스를 배포합니다..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "APP_DEBUG=false" \
  --set-env-vars "TIMEZONE=Asia/Seoul" \
  --set-env-vars "PHP_API_URL=http://localhost:8081"

# 7. 서비스 URL 출력
log_info "배포된 서비스 정보를 확인합니다..."
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

log_success "🎉 Fortune AI Cloud Run 배포가 완료되었습니다!"
echo ""
echo "📋 서비스 정보:"
echo "  • 서비스 이름: ${SERVICE_NAME}"
echo "  • 지역: ${REGION}"
echo "  • URL: ${SERVICE_URL}"
echo "  • 이미지: ${IMAGE_NAME}:latest"
echo ""
echo "🔧 유용한 명령어:"
echo "  • 서비스 상태 확인: gcloud run services describe ${SERVICE_NAME} --region=${REGION}"
echo "  • 로그 확인: gcloud logs read --service=${SERVICE_NAME} --region=${REGION}"
echo "  • 서비스 삭제: gcloud run services delete ${SERVICE_NAME} --region=${REGION}"
echo ""

# 8. 헬스체크
log_info "서비스 헬스체크를 수행합니다..."
sleep 10

if curl -s -f "${SERVICE_URL}/api/convert-proxy" > /dev/null; then
    log_success "✅ 서비스가 정상적으로 작동 중입니다!"
    echo "🌐 웹사이트: ${SERVICE_URL}"
    echo "🔗 API 테스트: ${SERVICE_URL}/api/convert-proxy"
else
    log_warning "⚠️ 서비스 헬스체크에 실패했습니다. 잠시 후 다시 시도해주세요."
    echo "🔍 로그 확인: gcloud logs read --service=${SERVICE_NAME} --region=${REGION}"
fi
