# 연화당 정통사주 - 멀티서비스 구조

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
- Node.js 20 LTS
- PHP 8.0+
- Git

### 전체 프로젝트 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd fortune-ai
```

2. **웹 애플리케이션 실행**
```bash
cd web
npm install
npm run dev
```

3. **PHP API 실행** (별도 터미널)
```bash
cd php-api
php -S localhost:8000 lunar-converter.php
```

### 개별 서비스 실행

#### 웹 애플리케이션 (포트 3000)
```bash
cd web
npm install
npm run dev
```

#### PHP API (포트 8000)
```bash
cd php-api
php -S localhost:8000 lunar-converter.php
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

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**연화당 정통사주** - AI와 전통이 만나는 새로운 사주 서비스