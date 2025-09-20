# Next.js 15 개발 환경을 위한 Dockerfile
FROM node:20-alpine

# libc6-compat 설치 (sharp 등 이미지 라이브러리 호환성)
RUN apk add --no-cache libc6-compat

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 (캐시 최적화를 위해 의존성 설치 전에 복사)
COPY package*.json ./

# 의존성 설치 (개발 환경에서는 npm install 사용)
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 환경 변수 설정
ENV NODE_ENV=development

# 개발 서버 실행
CMD ["npm", "run", "dev", "--", "-p", "3000"]
