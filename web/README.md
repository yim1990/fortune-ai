# 연화당 정통사주 - 웹 애플리케이션

Next.js 15 기반의 연화당 정통사주 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Pattern Matching**: ts-pattern
- **Utilities**: es-toolkit

## 📁 프로젝트 구조

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   └── ui/                # shadcn UI 컴포넌트
│   ├── hooks/                 # 커스텀 훅
│   └── lib/                   # 유틸리티 함수
│       ├── supabase/          # Supabase 클라이언트
│       └── utils.ts
├── public/                    # 정적 파일
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 사용 가능한 명령어

### 개발
```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 실행
```

### 유틸리티
```bash
npm run type-check   # TypeScript 타입 체크
```

## 🌐 환경 변수

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# 기타 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 주요 기능

1. **사주 입력 폼**: 생년월일시, 성별, 이름, 전화번호 입력
2. **결제 시스템**: 29,800원 결제 처리
3. **결과 표시**: AI 해석 및 웹툰 스타일 결과
4. **SNS 공유**: 인스타그램, 카카오톡 공유
5. **사용자 계정**: 결과 저장 및 관리

## 🔗 API 연동

- **PHP 만세력 API**: `/php-api` 서비스와 연동
- **Supabase**: 데이터베이스 및 인증
- **OpenAI**: AI 해석 생성

## 📚 추가 문서

- [루트 README](../README.md) - 전체 프로젝트 개요
- [PRD](../vooster-docs/prd.md) - 제품 요구사항 문서
- [아키텍처](../vooster-docs/architecture.md) - 시스템 아키텍처
- [개발 가이드라인](../vooster-docs/guideline.md) - 개발 규칙 및 컨벤션
