# 환경변수 설정 가이드

## 📁 환경변수 파일 구조

Next.js는 다음 순서로 환경변수를 로드합니다:

1. `.env.local` (모든 환경, git에서 제외) - 개인별 로컬 설정
2. `.env.development` (개발 환경) - 개발용 공통 설정
3. `.env.production` (프로덕션 환경) - 프로덕션용 공통 설정
4. `.env` (기본값) - 모든 환경 공통 기본값

## 🔧 환경별 설정

### 개발 환경 (Development)
- **파일**: `.env.development`
- **용도**: 로컬 개발 서버 실행 시 사용
- **특징**: 디버그 모드 활성화, 개발용 API URL, 개발용 카카오 앱 키

### 프로덕션 환경 (Production)
- **파일**: `.env.production`
- **용도**: 프로덕션 빌드 및 배포 시 사용
- **특징**: 디버그 모드 비활성화, 프로덕션 API URL, 프로덕션 카카오 앱 키

### 로컬 환경 (Local)
- **파일**: `.env.local`
- **용도**: 개인별 로컬 개발 설정
- **특징**: git에 커밋되지 않음, 개인별 특별한 설정용

## 🚀 사용 방법

### 개발 서버 실행
```bash
# 개발 환경으로 실행 (자동으로 .env.development 로드)
npm run dev

# 또는 명시적으로 개발 환경 지정
NODE_ENV=development npm run dev
```

### 프로덕션 빌드
```bash
# 프로덕션 빌드 (자동으로 .env.production 로드)
npm run build

# 또는 명시적으로 프로덕션 환경 지정
NODE_ENV=production npm run build
```

## 🔐 보안 주의사항

### Git에서 제외되는 파일들
- `.env.local` - 개인별 로컬 설정
- `.env.development` - 개발용 설정 (민감한 정보 포함 가능)
- `.env.production` - 프로덕션용 설정 (민감한 정보 포함)

### Git에 포함되는 파일들
- `.env` - 공통 기본값만 포함 (민감한 정보 없음)
- `.env.example` - 예시 파일 (실제 값 없음)

## 📝 환경변수 추가 방법

### 1. 공통 기본값 추가
`.env` 파일에 추가:
```bash
# 새로운 환경변수
NEW_VARIABLE=default_value
```

### 2. 환경별 특정 값 추가
`.env.development` 또는 `.env.production`에 추가:
```bash
# 개발 환경용 값
NEW_VARIABLE=development_value

# 프로덕션 환경용 값
NEW_VARIABLE=production_value
```

### 3. 개인별 로컬 설정 추가
`.env.local` 파일에 추가:
```bash
# 개인별 특별한 설정
NEW_VARIABLE=my_local_value
```

## 🔄 환경변수 우선순위

같은 변수가 여러 파일에 정의된 경우:
1. `.env.local` (최우선)
2. `.env.development` 또는 `.env.production` (환경별)
3. `.env` (기본값)

## ⚠️ 주의사항

1. **민감한 정보는 절대 `.env` 파일에 넣지 마세요**
2. **프로덕션 키는 실제 배포 시에만 설정하세요**
3. **`.env.local`은 개인별 설정용이므로 팀원과 공유하지 마세요**
4. **환경변수 변경 후에는 서버를 재시작하세요**

## 🛠️ 문제 해결

### 환경변수가 로드되지 않는 경우
1. 파일명이 정확한지 확인 (`.env.development`, `.env.production`)
2. 서버 재시작
3. `NODE_ENV` 환경변수 확인

### 개발/프로덕션 환경이 잘못 로드되는 경우
1. `NODE_ENV` 환경변수 확인
2. 파일명 확인
3. 환경변수 우선순위 확인
