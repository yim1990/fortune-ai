# Fortune AI - 환경변수 설정 가이드

## 📁 환경변수 파일 구조

프로젝트 루트에 통합된 환경변수 파일들이 있습니다:

```
프로젝트 루트/
├── .env                    # 공통 기본 설정
├── .env.development       # 개발 환경 설정
├── .env.production        # 프로덕션 환경 설정
├── .env.cloudrun          # Cloud Run 배포용 설정
└── .env.example           # 예시 파일 (보안 정보 제외)
```

## 🚀 빠른 시작

### 1. 개발 환경 설정

```bash
# 1. 예시 파일을 복사하여 개발용 환경변수 생성
cp .env.example .env.development

# 2. 실제 API 키와 설정값으로 수정
# - OPENAI_API_KEY: OpenAI API 키
# - KAKAO_CLIENT_ID: 카카오 OAuth 앱 키
# - KAKAO_CLIENT_SECRET: 카카오 OAuth 시크릿
# - NEXT_PUBLIC_SUPABASE_URL: Supabase 프로젝트 URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase 익명 키
# - SUPABASE_SERVICE_ROLE_KEY: Supabase 서비스 역할 키

# 3. Docker로 개발 서버 실행
docker-compose up -d
```

### 2. 프로덕션 환경 설정

```bash
# 1. 프로덕션용 환경변수 생성
cp .env.example .env.production

# 2. 프로덕션용 실제 값으로 수정
# - 모든 API 키를 프로덕션용으로 교체
# - DEBUG=false로 설정
# - LOG_LEVEL=error로 설정

# 3. 프로덕션 배포
docker-compose -f docker-compose.production.yml up -d
```

### 3. Cloud Run 배포 설정

```bash
# 1. Cloud Run용 환경변수 생성
cp .env.example .env.cloudrun

# 2. Cloud Run용 설정으로 수정
# - PHP_API_URL=http://localhost:8081
# - KAKAO_REDIRECT_URI=https://your-cloudrun-url.run.app/api/auth/kakao/callback
# - CORS_ORIGIN=https://your-cloudrun-url.run.app

# 3. Cloud Run 배포
./scripts/deploy-cloudrun.sh
```

## 🔧 환경별 설정 차이점

### 개발 환경 (.env.development)
- `NODE_ENV=development`
- `APP_DEBUG=true`
- `LOG_LEVEL=debug`
- `API_TIMEOUT=30000` (30초)
- `PHP_API_URL=http://php-api:8080` (Docker 내부 통신)

### 프로덕션 환경 (.env.production)
- `NODE_ENV=production`
- `APP_DEBUG=false`
- `LOG_LEVEL=error`
- `API_TIMEOUT=15000` (15초)
- `PHP_API_URL=http://php-api:8080` (Docker 내부 통신)

### Cloud Run 환경 (.env.cloudrun)
- `NODE_ENV=production`
- `APP_DEBUG=false`
- `LOG_LEVEL=error`
- `API_TIMEOUT=10000` (10초)
- `PHP_API_URL=http://localhost:8081` (같은 컨테이너 내부)

## 🔐 보안 설정

### 필수 보안 환경변수

1. **OpenAI API 키**
   ```bash
   OPENAI_API_KEY=sk-proj-...
   ```

2. **카카오 OAuth 설정**
   ```bash
   KAKAO_CLIENT_ID=your_kakao_client_id
   KAKAO_CLIENT_SECRET=your_kakao_client_secret
   KAKAO_REDIRECT_URI=https://your-domain.com/api/auth/kakao/callback
   ```

3. **Supabase 설정**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **세션 보안**
   ```bash
   SESSION_SECRET=your_32_character_minimum_secret_key
   APP_KEY=your_app_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

## 📝 환경변수 우선순위

Next.js는 다음 순서로 환경변수를 로드합니다:

1. `.env.local` (모든 환경에서 로드, git에 추가하지 않음)
2. `.env.development` (개발 환경에서만 로드)
3. `.env.production` (프로덕션 환경에서만 로드)
4. `.env` (기본값)

## 🐳 Docker 환경변수 로딩

### 개발 환경
```yaml
# docker-compose.yml
volumes:
  - ./.env.development:/app/.env.local  # Next.js 웹 서비스
  - ./.env.development:/var/www/html/.env  # PHP API 서비스
```

### 프로덕션 환경
```yaml
# docker-compose.production.yml
volumes:
  - ./.env.production:/app/.env.local  # Next.js 웹 서비스
  - ./.env.production:/var/www/html/.env  # PHP API 서비스
```

### Cloud Run 환경
```dockerfile
# Dockerfile.cloudrun
COPY .env.cloudrun /app/.env.local
```

## 🔍 환경변수 확인

### 개발 환경에서 확인
```bash
# Docker 컨테이너 내부에서 확인
docker exec -it fortune-ai-web printenv | grep -E "(NODE_ENV|API_TIMEOUT|PHP_API_URL)"

# PHP API 컨테이너에서 확인
docker exec -it fortune-ai-php-api printenv | grep -E "(APP_ENV|OPENAI_API_KEY|LOG_LEVEL)"
```

### 로컬에서 확인
```bash
# Next.js 환경변수 확인
cd web && npm run dev
# 브라우저에서 http://localhost:3000/api/test-api 접속

# PHP API 환경변수 확인
cd php-api && php -r "echo getenv('APP_ENV') . PHP_EOL;"
```

## ⚠️ 주의사항

1. **보안 정보 보호**
   - `.env.local` 파일은 절대 git에 커밋하지 마세요
   - 실제 API 키는 환경별로 다르게 설정하세요
   - 프로덕션에서는 강력한 비밀키를 사용하세요

2. **환경별 설정**
   - 개발/프로덕션/Cloud Run 환경별로 적절한 설정을 사용하세요
   - API 타임아웃, 로그 레벨, 디버그 모드 등을 환경에 맞게 조정하세요

3. **Docker 볼륨 마운트**
   - Docker 컨테이너가 올바른 환경변수 파일을 로드하는지 확인하세요
   - 볼륨 마운트 경로가 정확한지 확인하세요

## 🆘 문제 해결

### 환경변수가 로드되지 않는 경우
1. 파일 경로 확인: `ls -la .env*`
2. Docker 볼륨 마운트 확인: `docker-compose config`
3. 컨테이너 내부 확인: `docker exec -it container_name printenv`

### API 연결 오류
1. `PHP_API_URL` 설정 확인
2. Docker 네트워크 연결 확인
3. 포트 설정 확인

### 인증 오류
1. API 키 유효성 확인
2. 리다이렉트 URI 설정 확인
3. CORS 설정 확인
