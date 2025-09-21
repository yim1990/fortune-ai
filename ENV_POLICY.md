# 환경변수 파일 관리 정책

## 📋 정책 개요

이 프로젝트에서는 환경변수 파일을 다음과 같은 정책으로 관리합니다.

## ✅ 사용할 파일

### `.env.example`
- **목적**: 모든 환경변수의 템플릿 파일
- **내용**: 예시 값과 설명이 포함된 모든 환경변수
- **용도**: 새로운 개발자가 프로젝트를 시작할 때 참고
- **Git**: 버전 관리에 포함됨

### `.env.{환경이름}`
- **목적**: 특정 환경별 실제 설정 파일
- **예시**: 
  - `.env.development` - 개발 환경
  - `.env.production` - 운영 환경
  - `.env.cloudrun` - Cloud Run 배포 환경
- **내용**: 각 환경에 맞는 실제 값들
- **Git**: 버전 관리에 포함됨 (민감한 정보 제외)

## ❌ 사용하지 않을 파일

### `.env.local`
- **금지 이유**: Next.js에서 자동으로 로드되는 파일로, 환경별 관리가 어려움
- **대안**: `.env.development` 사용

### `.env`
- **금지 이유**: 환경을 명시하지 않아 혼란을 야기할 수 있음
- **대안**: `.env.{환경이름}` 사용

## 🔧 사용 방법

### 1. 새로운 환경변수 추가 시
```bash
# 1. .env.example에 추가 (예시 값과 설명 포함)
echo "NEW_VARIABLE=your_example_value" >> .env.example

# 2. 각 환경별 파일에 실제 값 추가
echo "NEW_VARIABLE=actual_development_value" >> .env.development
echo "NEW_VARIABLE=actual_production_value" >> .env.production
```

### 2. 환경별 파일 생성 시
```bash
# .env.example을 복사하여 환경별 파일 생성
cp .env.example .env.staging
# 실제 값으로 수정
```

## 🚫 주의사항

1. **절대 생성하지 말 것**: `.env.local`, `.env`
2. **민감한 정보**: 실제 API 키, 비밀번호 등은 각 환경별 파일에만 저장
3. **Git 관리**: `.env.example`은 반드시 Git에 포함, 환경별 파일은 민감한 정보 제외하고 포함
4. **일관성**: 모든 환경별 파일은 `.env.example`과 동일한 변수명 유지

## 📝 예시

### .env.example
```bash
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fortune_ai
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# API 키
OPENAI_API_KEY=your_openai_api_key
TOSS_CLIENT_KEY=test_ck_demo
TOSS_SECRET_KEY=test_sk_demo
```

### .env.development
```bash
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fortune_ai_dev
DB_USER=dev_user
DB_PASSWORD=dev_password

# API 키
OPENAI_API_KEY=sk-proj-dev-key-here
TOSS_CLIENT_KEY=test_ck_demo
TOSS_SECRET_KEY=test_sk_demo
```

### .env.production
```bash
# 데이터베이스 설정
DB_HOST=prod-db-host
DB_PORT=3306
DB_NAME=fortune_ai_prod
DB_USER=prod_user
DB_PASSWORD=prod_secure_password

# API 키
OPENAI_API_KEY=sk-proj-prod-key-here
TOSS_CLIENT_KEY=live_ck_prod_key
TOSS_SECRET_KEY=live_sk_prod_key
```

## 🔄 마이그레이션 가이드

기존 `.env.local` 사용 시:
1. `.env.local`의 내용을 `.env.development`로 이동
2. `.env.local` 파일 삭제
3. `.env.example`에 누락된 변수 추가

---

**이 정책은 프로젝트의 일관성과 유지보수성을 위해 반드시 준수해야 합니다.**
