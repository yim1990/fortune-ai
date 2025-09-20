# Fortune AI 배포 가이드

## 🚀 Nginx 기반 프로덕션 배포

### 📋 사전 요구사항

- Docker 20.10+
- Docker Compose 2.0+
- 최소 2GB RAM
- 최소 10GB 디스크 공간

### 🔧 배포 방법

#### 1. 환경 변수 설정

```bash
# .env.production 파일 복사
cp .env.production.example .env.production

# OpenAI API 키 설정
nano .env.production
```

#### 2. 자동 배포 (권장)

```bash
# 배포 스크립트 실행
./deploy.sh
```

#### 3. 수동 배포

```bash
# Docker 이미지 빌드
docker-compose build

# 서비스 시작
docker-compose up -d

# 상태 확인
docker-compose ps
```

### 🌐 서비스 접근

- **API 엔드포인트**: http://localhost
- **헬스체크**: http://localhost/healthz
- **만세력 변환**: http://localhost/api/convert

### 📊 모니터링

#### 로그 확인
```bash
# 전체 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs nginx
docker-compose logs php

# 실시간 로그
docker-compose logs -f
```

#### 컨테이너 상태
```bash
# 실행 중인 컨테이너
docker-compose ps

# 리소스 사용량
docker stats
```

### 🔧 설정 파일

#### Nginx 설정 (`nginx.conf`)
- URL 리라이팅
- CORS 설정
- 보안 헤더
- Gzip 압축
- 정적 파일 캐싱

#### PHP 설정 (`php-api/Dockerfile`)
- PHP 8.2-FPM
- OPcache 활성화
- 메모리 최적화
- PEAR 패키지 자동 설치

### 🛠️ 문제 해결

#### 서비스가 시작되지 않는 경우
```bash
# 로그 확인
docker-compose logs

# 컨테이너 재시작
docker-compose restart

# 완전 재시작
docker-compose down && docker-compose up -d
```

#### API 응답이 느린 경우
```bash
# PHP-FPM 프로세스 확인
docker-compose exec php ps aux | grep php-fpm

# Nginx 설정 확인
docker-compose exec nginx nginx -t
```

#### 메모리 부족
```bash
# Docker 메모리 제한 확인
docker stats

# PHP 메모리 설정 조정
# php-api/Dockerfile에서 memory_limit 수정
```

### 🔒 보안 설정

#### 프로덕션 환경 보안 체크리스트

- [ ] `.env.production`에서 실제 API 키 설정
- [ ] `APP_DEBUG=false` 설정 확인
- [ ] 불필요한 포트 노출 제거
- [ ] SSL 인증서 설정 (HTTPS)
- [ ] 방화벽 설정
- [ ] 정기적인 보안 업데이트

#### SSL 설정 (선택사항)

```bash
# Let's Encrypt 인증서 생성
certbot certonly --standalone -d your-domain.com

# SSL 설정을 위한 nginx.conf 수정
# 443 포트 및 SSL 인증서 경로 설정
```

### 📈 성능 최적화

#### Nginx 최적화
- Gzip 압축 활성화
- 정적 파일 캐싱
- Keep-alive 연결
- Worker 프로세스 수 조정

#### PHP 최적화
- OPcache 활성화
- 메모리 제한 최적화
- 프로세스 풀 크기 조정

#### 데이터베이스 최적화 (필요시)
- 인덱스 최적화
- 쿼리 캐싱
- 연결 풀 설정

### 🔄 업데이트 및 백업

#### 코드 업데이트
```bash
# Git에서 최신 코드 가져오기
git pull origin main

# 재배포
./deploy.sh
```

#### 데이터 백업
```bash
# 컨테이너 데이터 백업
docker-compose exec php tar -czf /backup/fortune-ai-$(date +%Y%m%d).tar.gz /var/www/html

# 설정 파일 백업
cp nginx.conf docker-compose.yml .env.production /backup/
```

### 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **로그 파일**: `docker-compose logs`
2. **시스템 리소스**: `docker stats`
3. **네트워크 연결**: `curl http://localhost/healthz`
4. **설정 파일**: `.env.production` 값 확인

---

**Fortune AI** - 만세력 변환 및 사주 해석 API 서버
