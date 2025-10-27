# 여우도령 정통사주 - 멀티서비스 구조

전통 사주(사주팔자)를 AI 기술과 웹툰 형식으로 재해석하여, 20-30대 여성이 쉽고 재미있게 자신의 운세를 이해하고 공유할 수 있도록 돕는 온라인 서비스입니다.

## 📁 프로젝트 구조

```
fortune-ai/
├── php-api/              # PHP 만세력 API 서버
│   └── lunar-converter.php
├── web/                  # Next.js 15 웹 애플리케이션
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── supabase/             # 데이터베이스 마이그레이션
│   └── migrations/
├── vooster-docs/         # 프로젝트 문서
│   ├── prd.md
│   ├── architecture.md
│   └── ...
└── README.md
```

## 🚀 서비스 개요

### /php-api - PHP 만세력 API
- **역할**: 전통 만세력 계산 및 사주팔자 데이터 제공
- **기술스택**: PHP 8.0+
- **주요 기능**: 
  - 생년월일시를 통한 만세력 변환
  - 사주팔자 데이터 계산
  - RESTful API 제공

### /web - Next.js 웹 애플리케이션
- **역할**: 사용자 인터페이스 및 비즈니스 로직
- **기술스택**: Next.js 15, TypeScript, TailwindCSS, shadcn UI
- **주요 기능**:
  - 사용자 입력 폼 (생년월일시, 성별, 이름, 전화번호)
  - 결제 모듈 (카드, 간편결제)
  - AI 해석 및 웹툰 결과 표시
  - SNS 공유 기능
  - 사용자 계정 관리

## 🛠️ 개발 환경 설정

### 사전 요구사항
- Docker & Docker Compose
- Node.js 20 LTS (로컬 개발시)
- PHP 8.0+ (로컬 개발시)

### 🚀 빠른 시작 (권장)

#### 1. 저장소 클론
```bash
git clone <repository-url>
cd fortune-ai
```

#### 2. 환경변수 설정
```bash
# 루트 환경변수 복사
cp .env.example .env

# 웹 서비스 환경변수 설정 (선택사항)
cp web/.env.example web/.env.local

# PHP API 환경변수 설정 (선택사항)
cp php-api/.env.example php-api/.env
```

#### 3. 개발환경 시작
```bash
# 편의 스크립트 사용 (권장)
./scripts/dev-up.sh

# 또는 직접 실행
docker-compose up -d --build
```

#### 4. 서비스 접근
- **웹 애플리케이션**: http://localhost:3000
- **API 테스트 페이지**: http://localhost:3000/test-api
- **PHP API**: http://localhost:8080
- **PHP API 헬스체크**: http://localhost:8080/healthz

### 📋 개발 스크립트

프로젝트에는 개발 편의를 위한 스크립트들이 제공됩니다:

#### 기본 스크립트
```bash
# 개발환경 시작
./scripts/dev-up.sh

# 개발환경 종료
./scripts/dev-down.sh

# 개발환경 재시작
./scripts/dev-restart.sh

# 로그 확인
./scripts/dev-logs.sh [서비스명] [옵션]
```

#### 로그 확인 옵션
```bash
# 모든 서비스 로그 (실시간)
./scripts/dev-logs.sh

# 특정 서비스 로그
./scripts/dev-logs.sh web
./scripts/dev-logs.sh php-api

# 마지막 N줄만 표시
./scripts/dev-logs.sh web -t 50
./scripts/dev-logs.sh php-api --tail 100
```

### 🔧 수동 명령어

스크립트를 사용하지 않고 직접 Docker Compose 명령어를 사용할 수도 있습니다:

```bash
# 서비스 시작
docker-compose up -d --build

# 서비스 종료
docker-compose down -v

# 로그 확인
docker-compose logs -f [service-name]

# 컨테이너 상태 확인
docker-compose ps

# 특정 서비스 재시작
docker-compose restart [service-name]
```
- Git

### 🐳 Docker 통합 개발환경 (권장)

1. **저장소 클론**
```bash
git clone <repository-url>
cd fortune-ai
```

2. **환경변수 설정**
```bash
# 환경변수 파일 복사
cp .env.example .env

# 필요한 값들 수정 (OpenAI API 키 등)
nano .env
```

3. **통합 환경 실행**
```bash
# 모든 서비스 한번에 실행
docker-compose up -d --build

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f
```

4. **서비스 접근**
- **웹 애플리케이션**: http://localhost:3000
- **PHP API**: 컨테이너 내부에서만 접근 가능 (보안)

### 🔧 환경변수 설정

#### 주요 환경변수
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

#### 환경변수 파일 구조
- **루트 `.env`**: 전체 프로젝트 공통 설정
- **`web/.env.local`**: Next.js 전용 설정
- **`php-api/.env`**: PHP API 전용 설정

#### 로컬 오버라이드 방법
```bash
# 개발자별 개인 설정
cp .env.example .env.local
# .env.local 파일에서 개인 설정 수정
```

### 🖥️ 로컬 개발환경 (Docker 없이)

#### 웹 애플리케이션 (포트 3000)
```bash
cd web
npm install
npm run dev
```

#### PHP API (포트 8080)
```bash
cd php-api
composer install
php -S localhost:8080 -t public
```

### 🐳 Docker 명령어

```bash
# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 특정 서비스 재시작
docker-compose restart web

# 컨테이너 내부 접근
docker-compose exec web sh
docker-compose exec php-api sh

# 환경변수 확인
docker-compose exec web printenv
```

## 📋 주요 기능

1. **사주 입력**: 생년월일시, 성별, 이름, 전화번호 입력
2. **결제 처리**: 29,800원 결제 (카드, 간편결제)
3. **만세력 계산**: PHP API를 통한 정확한 사주팔자 계산
4. **AI 해석**: GPT를 활용한 개인화된 사주 해석
5. **웹툰 결과**: 캐릭터 기반의 재미있는 결과 표시
6. **SNS 공유**: 인스타그램, 카카오톡 공유 기능

## 🔧 기술 스택

### Frontend (web/)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Validation**: Zod

### Backend (php-api/)
- **Language**: PHP 8.0+
- **Purpose**: 만세력 계산 API

### Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## 📚 문서

- [PRD (Product Requirements Document)](./vooster-docs/prd.md)
- [아키텍처 설계](./vooster-docs/architecture.md)
- [개발 가이드라인](./vooster-docs/guideline.md)
- [디자인 가이드](./vooster-docs/design-guide.md)
- [정보 아키텍처](./vooster-docs/ia.md)
- [단계별 구현 가이드](./vooster-docs/step-by-step.md)
- [클린 코드 가이드](./vooster-docs/clean-code.md)

## 🚦 개발 워크플로우

### 브랜치 전략
- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 커밋 컨벤션
```
type(scope): description

feat(web): 사용자 입력 폼 컴포넌트 추가
fix(api): 만세력 계산 오류 수정
docs: README 업데이트
```

### 타입 설명
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

## 🚀 배포

### 웹 애플리케이션
- **플랫폼**: Vercel
- **도메인**: [배포 URL]
- **환경변수**: Vercel 대시보드에서 설정

### PHP API
- **플랫폼**: [PHP 호스팅 서비스]
- **도메인**: [API URL]

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE)를 따릅니다.

## 🔧 트러블슈팅

### 자주 발생하는 문제들

#### Q: Docker 컨테이너가 시작되지 않아요
**A:** 다음 단계를 확인해보세요:
```bash
# Docker 서비스 상태 확인
docker --version
docker-compose --version

# 포트 충돌 확인
lsof -i :3000
lsof -i :8080

# 컨테이너 로그 확인
docker-compose logs
```

#### Q: 웹 서비스에 접근할 수 없어요 (localhost:3000)
**A:** 다음을 확인해보세요:
```bash
# 컨테이너 상태 확인
docker-compose ps

# 웹 서비스 로그 확인
./scripts/dev-logs.sh web

# 포트 확인
curl -I http://localhost:3000
```

#### Q: PHP API에 연결할 수 없어요 (localhost:8080)
**A:** 다음을 확인해보세요:
```bash
# PHP API 컨테이너 상태 확인
docker-compose ps php-api

# PHP API 로그 확인
./scripts/dev-logs.sh php-api

# 헬스체크
curl http://localhost:8080/healthz
```

#### Q: API 프록시가 작동하지 않아요
**A:** 다음을 확인해보세요:
```bash
# 웹 서비스에서 PHP API 접근 테스트
docker-compose exec web curl http://php-api:8080/healthz

# 환경변수 확인
docker-compose exec web printenv | grep PHP_API_URL

# 프록시 상태 확인
curl http://localhost:3000/api/convert-proxy
```

#### Q: 환경변수가 적용되지 않아요
**A:** 다음을 확인해보세요:
```bash
# .env 파일 존재 확인
ls -la .env*

# 환경변수 파일 내용 확인
cat .env

# 컨테이너 재시작
./scripts/dev-restart.sh
```

#### Q: 스크립트 실행 권한이 없어요
**A:** 다음 명령어로 권한을 부여하세요:
```bash
chmod +x scripts/*.sh
```

#### Q: Windows에서 스크립트를 실행할 수 없어요
**A:** Windows에서는 다음 방법을 사용하세요:
```bash
# Git Bash 또는 WSL 사용
./scripts/dev-up.sh

# 또는 직접 Docker Compose 명령어 사용
docker-compose up -d --build
```

### 로그 확인 방법

```bash
# 모든 서비스 로그 (실시간)
./scripts/dev-logs.sh

# 특정 서비스 로그
./scripts/dev-logs.sh web
./scripts/dev-logs.sh php-api

# 마지막 50줄만 표시
./scripts/dev-logs.sh web -t 50
```

### 컨테이너 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 컨테이너 상세 정보
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# 특정 서비스 재시작
docker-compose restart web
docker-compose restart php-api
```

### 완전 초기화

문제가 지속되면 완전 초기화를 시도해보세요:
```bash
# 모든 컨테이너 및 볼륨 제거
docker-compose down -v --remove-orphans

# 사용하지 않는 이미지 제거
docker image prune -f

# 다시 시작
./scripts/dev-up.sh
```

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**여우도령 정통사주** - AI와 전통이 만나는 새로운 사주 서비스