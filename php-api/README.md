# 연화당 정통사주 - PHP 만세력 API

전통 만세력 계산을 위한 PHP API 서버입니다.

## 🚀 빠른 시작

### 환경변수 설정

프로젝트 루트의 환경변수 파일을 사용합니다:

```bash
# 개발 환경
cp ../.env.development .env

# 프로덕션 환경  
cp ../.env.production .env
```

### 개발 서버 실행

```bash
# Composer를 사용한 개발 서버 실행 (권장)
composer run dev

# 또는 직접 실행
php -S localhost:8080 -t public
```

API는 [http://localhost:8080](http://localhost:8080)에서 실행됩니다.

### 환경변수 테스트

```bash
curl http://localhost:8080/api/test-env
```

## 🛠️ 기술 스택

- **Language**: PHP 8.0+
- **Purpose**: 만세력 계산 및 사주팔자 데이터 제공
- **API Style**: RESTful

## 📁 프로젝트 구조

```
php-api/
├── lunar-converter.php    # 메인 API 파일
└── README.md             # 이 파일
```

## 🔧 API 엔드포인트

### 만세력 변환

**POST** `/lunar-converter.php`

#### 요청 데이터
```json
{
  "birth_date": "1990-01-01",
  "birth_time": "14:30",
  "gender": "female",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

#### 응답 데이터
```json
{
  "success": true,
  "data": {
    "lunar_date": "1989-12-05",
    "saju": {
      "year": "기사",
      "month": "정축",
      "day": "갑자",
      "hour": "신미"
    },
    "elements": {
      "heavenly_stems": ["기", "정", "갑", "신"],
      "earthly_branches": ["사", "축", "자", "미"]
    },
    "interpretation": "사주 해석 데이터..."
  }
}
```

## 🌐 환경 변수

### 자동 로딩

PHP API는 프로젝트 루트의 환경변수 파일을 자동으로 로드합니다:

- **개발 환경**: `.env.development` → `php-api/.env`
- **프로덕션 환경**: `.env.production` → `php-api/.env`

### 주요 환경변수

```bash
# 애플리케이션 설정
APP_ENV=development
APP_DEBUG=true
TIMEZONE=Asia/Seoul

# API 설정
OPENAI_API_KEY=your_openai_api_key_here
SERVER_PORT=8080
LOG_LEVEL=debug

# 로그 설정
LOG_FILE=logs/api.log
```

### PHP 설정

```ini
; php.ini 설정
date.timezone = Asia/Seoul
default_charset = UTF-8
```

## 📱 주요 기능

1. **만세력 변환**: 양력 날짜를 음력으로 변환
2. **사주팔자 계산**: 생년월일시를 통한 사주 계산
3. **오행 분석**: 천간지지 및 오행 분석
4. **RESTful API**: JSON 형태의 데이터 제공

## 🔗 연동 서비스

- **웹 애플리케이션**: `/web` 서비스와 연동
- **데이터베이스**: 필요시 MySQL/PostgreSQL 연동 가능

## 🚦 에러 처리

### 일반적인 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE",
    "message": "유효하지 않은 날짜 형식입니다.",
    "details": "날짜는 YYYY-MM-DD 형식이어야 합니다."
  }
}
```

### 에러 코드

- `INVALID_DATE`: 잘못된 날짜 형식
- `INVALID_TIME`: 잘못된 시간 형식
- `INVALID_GENDER`: 잘못된 성별 값
- `CALCULATION_ERROR`: 만세력 계산 오류
- `SERVER_ERROR`: 서버 내부 오류

## 📚 추가 문서

- [루트 README](../README.md) - 전체 프로젝트 개요
- [PRD](../vooster-docs/prd.md) - 제품 요구사항 문서
- [아키텍처](../vooster-docs/architecture.md) - 시스템 아키텍처

## 🔧 개발 가이드

### 로컬 개발 환경 설정

1. PHP 8.0+ 설치
2. Composer 의존성 설치
3. 환경변수 설정
4. 개발 서버 실행

```bash
cd php-api

# 의존성 설치
composer install

# 환경변수 설정 (개발용)
cp ../.env.development .env

# 개발 서버 실행
composer run dev
```

### 프로덕션 배포

1. 웹 서버 설정 (Apache/Nginx)
2. PHP 설정 최적화
3. 보안 설정 적용

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다
3. 변경사항을 커밋합니다
4. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 [MIT 라이선스](../LICENSE)를 따릅니다.
