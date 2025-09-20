# ☁️ GCP Cloud Run 배포 가이드

## 📋 개요

이 가이드는 Fortune AI 애플리케이션을 GCP Cloud Run에 배포하는 방법을 설명합니다.

## 🚀 빠른 시작

### 1. 사전 준비

#### GCP 프로젝트 설정
```bash
# 1. GCP 프로젝트 생성 또는 선택
gcloud projects create fortune-ai-project --name="Fortune AI"
gcloud config set project fortune-ai-project

# 2. 필요한 API 활성화
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

#### gcloud CLI 설치 (macOS)
```bash
# Homebrew로 설치
brew install google-cloud-sdk

# 또는 공식 설치 스크립트
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2. 자동 배포 (권장)

```bash
# 배포 스크립트 실행
./scripts/deploy-cloudrun.sh
```

### 3. 수동 배포

```bash
# 1. Docker 이미지 빌드
docker build -f Dockerfile.cloudrun -t gcr.io/fortune-ai-project/fortune-ai:latest .

# 2. Google Container Registry에 푸시
docker push gcr.io/fortune-ai-project/fortune-ai:latest

# 3. Cloud Run 서비스 배포
gcloud run deploy fortune-ai \
  --image gcr.io/fortune-ai-project/fortune-ai:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --concurrency 80
```

## 🔧 상세 설정

### Cloud Run 서비스 설정

| 설정 | 값 | 설명 |
|------|-----|------|
| **서비스 이름** | `fortune-ai` | Cloud Run 서비스 이름 |
| **지역** | `asia-northeast1` | 도쿄 리전 |
| **포트** | `8080` | 애플리케이션 포트 |
| **메모리** | `2Gi` | 최대 메모리 |
| **CPU** | `2` | CPU 코어 수 |
| **최대 인스턴스** | `10` | 최대 동시 인스턴스 |
| **최소 인스턴스** | `0` | 최소 인스턴스 (비용 절약) |
| **타임아웃** | `300초` | 요청 타임아웃 |
| **동시성** | `80` | 인스턴스당 최대 동시 요청 |

### 환경 변수

| 변수명 | 설명 | 기본값 | 필수 |
|--------|------|--------|------|
| `NODE_ENV` | Node.js 환경 | production | ❌ |
| `APP_DEBUG` | 디버그 모드 | false | ❌ |
| `TIMEZONE` | 타임존 | Asia/Seoul | ❌ |
| `PHP_API_URL` | PHP API URL | http://localhost:8081 | ❌ |
| `OPENAI_API_KEY` | OpenAI API 키 | - | ✅ |

### 포트 설정

- **8080**: Next.js 웹 애플리케이션 (외부 접근)
- **8081**: PHP API 서버 (내부 통신)

## 📊 모니터링

### 로그 확인

```bash
# 실시간 로그
gcloud logs tail --service=fortune-ai --region=asia-northeast1

# 특정 시간대 로그
gcloud logs read --service=fortune-ai --region=asia-northeast1 --limit=100

# 에러 로그만
gcloud logs read --service=fortune-ai --region=asia-northeast1 --filter="severity>=ERROR"
```

### 서비스 상태 확인

```bash
# 서비스 정보
gcloud run services describe fortune-ai --region=asia-northeast1

# 서비스 목록
gcloud run services list --region=asia-northeast1

# 메트릭 확인
gcloud run services describe fortune-ai --region=asia-northeast1 --format="value(status.conditions)"
```

### 헬스체크

```bash
# 서비스 URL 확인
SERVICE_URL=$(gcloud run services describe fortune-ai --region=asia-northeast1 --format="value(status.url)")

# 웹사이트 접근 테스트
curl $SERVICE_URL

# API 테스트
curl $SERVICE_URL/api/convert-proxy
```

## 🔄 업데이트

### 이미지 업데이트

```bash
# 1. 새 이미지 빌드
docker build -f Dockerfile.cloudrun -t gcr.io/fortune-ai-project/fortune-ai:latest .

# 2. 이미지 푸시
docker push gcr.io/fortune-ai-project/fortune-ai:latest

# 3. 서비스 업데이트
gcloud run services update fortune-ai \
  --image gcr.io/fortune-ai-project/fortune-ai:latest \
  --region asia-northeast1
```

### 환경 변수 업데이트

```bash
# 환경 변수 설정
gcloud run services update fortune-ai \
  --region asia-northeast1 \
  --set-env-vars "OPENAI_API_KEY=your_new_api_key"

# 환경 변수 제거
gcloud run services update fortune-ai \
  --region asia-northeast1 \
  --remove-env-vars "OLD_VARIABLE"
```

## 🛠️ 문제 해결

### 일반적인 문제들

#### 1. 메모리 부족
```bash
# 메모리 증가
gcloud run services update fortune-ai --memory 4Gi --region asia-northeast1
```

#### 2. 타임아웃 오류
```bash
# 타임아웃 증가
gcloud run services update fortune-ai --timeout 600 --region asia-northeast1
```

#### 3. 콜드 스타트 지연
```bash
# 최소 인스턴스 설정 (비용 증가)
gcloud run services update fortune-ai --min-instances 1 --region asia-northeast1
```

#### 4. 빌드 실패
```bash
# 로컬에서 빌드 테스트
docker build -f Dockerfile.cloudrun -t test-image .

# 컨테이너 실행 테스트
docker run -p 8080:8080 test-image
```

### 로그 분석

```bash
# 에러 로그 확인
gcloud logs read --service=fortune-ai --region=asia-northeast1 --filter="severity>=ERROR" --limit=50

# 특정 시간대 로그
gcloud logs read --service=fortune-ai --region=asia-northeast1 --filter="timestamp>=\"2024-01-01T00:00:00Z\""
```

## 💰 비용 최적화

### 비용 절약 팁

```bash
# 1. 최소 인스턴스를 0으로 설정 (기본값)
gcloud run services update fortune-ai --min-instances 0 --region asia-northeast1

# 2. 메모리 최적화
gcloud run services update fortune-ai --memory 1Gi --region asia-northeast1

# 3. CPU 최적화
gcloud run services update fortune-ai --cpu 1 --region asia-northeast1

# 4. 동시성 증가 (인스턴스 수 감소)
gcloud run services update fortune-ai --concurrency 100 --region asia-northeast1
```

### 비용 모니터링

```bash
# 비용 확인
gcloud billing budgets list

# 사용량 확인
gcloud logging read "resource.type=cloud_run_revision" --limit=100
```

## 🔒 보안 설정

### 인증 설정

```bash
# 인증 필요로 변경
gcloud run services update fortune-ai \
  --no-allow-unauthenticated \
  --region asia-northeast1

# IAM 정책 설정
gcloud run services add-iam-policy-binding fortune-ai \
  --member="user:your-email@example.com" \
  --role="roles/run.invoker" \
  --region asia-northeast1
```

### 환경 변수 보안

```bash
# Secret Manager 사용
gcloud secrets create openai-api-key --data-file=api-key.txt

# Secret을 환경 변수로 사용
gcloud run services update fortune-ai \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest" \
  --region asia-northeast1
```

## 🌐 도메인 설정

### 커스텀 도메인 매핑

```bash
# 도메인 매핑
gcloud run domain-mappings create \
  --service fortune-ai \
  --domain your-domain.com \
  --region asia-northeast1

# SSL 인증서 확인
gcloud run domain-mappings describe your-domain.com --region asia-northeast1
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **로그 확인**: `gcloud logs read --service=fortune-ai --region=asia-northeast1`
2. **서비스 상태**: `gcloud run services describe fortune-ai --region=asia-northeast1`
3. **네트워크 연결**: `curl $(gcloud run services describe fortune-ai --region=asia-northeast1 --format="value(status.url)")`
4. **환경 변수**: `gcloud run services describe fortune-ai --region=asia-northeast1 --format="value(spec.template.spec.template.spec.containers[0].env)"`

---

**Fortune AI** - 만세력 변환 및 사주 해석 API 서버
