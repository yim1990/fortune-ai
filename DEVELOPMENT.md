# 개발 가이드

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# 저장소 클론
git clone <repository-url>
cd fortune-ai

# 환경변수 설정
cp .env.example .env
# .env 파일에서 필요한 값들 수정 (OpenAI API 키 등)
```

### 2. 개발환경 실행
```bash
# Docker 통합 환경 실행
docker-compose up -d --build

# 상태 확인
docker-compose ps
```

### 3. 서비스 접근
- **웹 애플리케이션**: http://localhost:3000
- **API 서버**: 컨테이너 내부에서만 접근 가능

## 🔧 환경변수 설정

### 루트 환경변수 (.env)
```bash
# 웹 서버 포트
WEB_PORT=3000

# PHP API 서버 URL (컨테이너 내부 통신)
PHP_API_URL=http://php-api:8080

# 타임존
TZ=Asia/Seoul

# 개발 환경
NODE_ENV=development
APP_ENV=development
APP_DEBUG=true

# OpenAI API 키 (필수)
OPENAI_API_KEY=your_openai_api_key_here
```

### 웹 애플리케이션 환경변수 (web/.env.local)
```bash
# Next.js 환경
NODE_ENV=development

# 웹 서버 포트
WEB_PORT=3000

# PHP API 서버 URL
PHP_API_URL=http://php-api:8080

# API 타임아웃
API_TIMEOUT=30000

# 디버그 모드
DEBUG=true
```

### PHP API 환경변수 (php-api/.env)
```bash
# 애플리케이션 환경
APP_ENV=development
APP_DEBUG=true

# 타임존
TIMEZONE=Asia/Seoul

# 서버 설정
SERVER_HOST=0.0.0.0
SERVER_PORT=8080

# OpenAI API 키
OPENAI_API_KEY=your_openai_api_key_here
```

## 🐳 Docker 개발환경

### 서비스 구성
- **web**: Next.js 웹 애플리케이션 (포트 3000)
- **php-api**: PHP API 서버 (포트 8080, 내부 전용)

### 네트워크 통신
- 웹 애플리케이션에서 PHP API 접근: `http://php-api:8080`
- 외부에서 PHP API 접근: 불가능 (보안)

### 주요 명령어
```bash
# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 특정 서비스 재시작
docker-compose restart web
docker-compose restart php-api

# 컨테이너 내부 접근
docker-compose exec web sh
docker-compose exec php-api sh

# 환경변수 확인
docker-compose exec web printenv
docker-compose exec php-api printenv
```

## 🖥️ 로컬 개발환경

### 웹 애플리케이션
```bash
cd web
npm install
npm run dev
# http://localhost:3000
```

### PHP API
```bash
cd php-api
composer install
php -S localhost:8080 -t public
# http://localhost:8080
```

## 🔍 디버깅

### 로그 확인
```bash
# 전체 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs web
docker-compose logs php-api

# 실시간 로그
docker-compose logs -f
```

### 환경변수 확인
```bash
# 웹 컨테이너 환경변수
docker-compose exec web printenv

# PHP API 컨테이너 환경변수
docker-compose exec php-api printenv
```

### 네트워크 테스트
```bash
# 웹에서 PHP API 접근 테스트
docker-compose exec web wget -qO- http://php-api:8080/healthz

# PHP API 헬스체크
docker-compose exec php-api curl http://localhost:8080/healthz
```

## 🚨 문제 해결

### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :8080

# 프로세스 종료
kill -9 <PID>
```

### 컨테이너 재시작
```bash
# 특정 서비스 재시작
docker-compose restart web

# 전체 재시작
docker-compose down
docker-compose up -d
```

### 캐시 초기화
```bash
# Docker 이미지 재빌드
docker-compose build --no-cache

# 컨테이너 완전 재생성
docker-compose down --volumes
docker-compose up -d --build
```

## 📝 개발 팁

### 환경변수 우선순위
1. `.env.local` (최우선)
2. `.env` (기본값)
3. 시스템 환경변수

### Hot Reload
- **웹 애플리케이션**: Next.js HMR 자동 지원
- **PHP API**: 파일 변경 시 자동 재시작

### 코드 스타일
- **웹**: ESLint + Prettier
- **PHP**: PSR-12 표준

## 🔗 유용한 링크

- [Next.js 문서](https://nextjs.org/docs)
- [PHP 문서](https://www.php.net/docs.php)
- [Docker Compose 문서](https://docs.docker.com/compose/)
- [TailwindCSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
