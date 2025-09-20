# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름과 데이터베이스 비밀번호 설정
4. 프로젝트 생성 완료

## 2. 환경변수 설정

### 2.1 Supabase 프로젝트 정보 확인

1. Supabase 대시보드에서 프로젝트 선택
2. Settings > API 메뉴로 이동
3. 다음 정보를 복사:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon public key**: `eyJ...`로 시작하는 긴 문자열
   - **service_role secret key**: `eyJ...`로 시작하는 긴 문자열 (주의: 이 키는 서버에서만 사용)

### 2.2 .env.local 파일 설정

`.env.local` 파일에서 다음 값들을 실제 값으로 교체하세요:

```bash
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co

# Supabase 익명 키 (클라이언트 사이드에서 사용)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase 서비스 역할 키 (서버 사이드에서만 사용)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 데이터베이스 테이블 생성

프로젝트에 이미 `members` 테이블이 생성되어 있습니다. 
필요시 추가 테이블을 생성할 수 있습니다.

## 4. 보안 주의사항

- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트 사이드에서 사용하지 마세요
- 이 키는 서버 사이드에서만 사용하며, 모든 데이터베이스 작업을 수행할 수 있습니다
- `.env.local` 파일은 git에 커밋되지 않도록 주의하세요

## 5. 테스트

환경변수 설정 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

API 엔드포인트 `/api/me`가 정상적으로 작동하는지 확인하세요.
