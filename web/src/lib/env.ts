/**
 * 환경 변수 유틸리티 함수
 * Cloud Run의 동적 URL을 처리합니다.
 */

/**
 * 기본 URL을 가져옵니다.
 * Cloud Run에서는 NEXT_PUBLIC_BASE_URL이 설정되고,
 * 로컬 개발에서는 localhost를 사용합니다.
 */
export function getBaseUrl(): string {
  // 서버 사이드에서 실행되는 경우
  if (typeof window === 'undefined') {
    // 환경 변수 우선 확인
    //console.log("getBaseUrl(): " + process.env.NEXT_PUBLIC_BASE_URL + " / " + process.env.HOST);

    // Cloud Run에서 실행되는 경우 - HOST 환경 변수로 판단
    if (process.env.HOST) {
      // Cloud Run에서는 HOST 환경 변수가 설정됨
      // Cloud Run의 실제 URL을 동적으로 가져오기
      return process.env.HOST;
    }
    
    // 로컬 개발 환경
    return 'http://localhost:3000';
  }
  
  // 클라이언트 사이드에서 실행되는 경우
  return window.location.origin;
}


/**
 * API URL을 가져옵니다.
 * Cloud Run에서는 내부 통신을 사용하고,
 * 로컬 개발에서는 외부 API를 사용합니다.
 */
export function getApiUrl(): string {
  // 서버 사이드에서 실행되는 경우
  if (typeof window === 'undefined') {
    // Cloud Run에서 실행되는 경우 (내부 통신)
    if (process.env.NODE_ENV === 'production' && process.env.PHP_API_URL) {
      return process.env.PHP_API_URL;
    }
    
    // 로컬 개발 환경
    return 'http://localhost:8080';
  }
  
  // 클라이언트 사이드에서 실행되는 경우
  return '/api/convert-proxy';
}

/**
 * 카카오 OAuth 리다이렉트 URI를 가져옵니다.
 */
export function getKakaoRedirectUri(): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/auth/kakao/callback`;
}

/**
 * CORS Origin을 가져옵니다.
 */
export function getCorsOrigin(): string {
  return getBaseUrl();
}

/**
 * 환경 변수 설정을 확인합니다.
 */
export function getEnvConfig() {
  return {
    baseUrl: getBaseUrl(),
    apiUrl: getApiUrl(),
    kakaoRedirectUri: getKakaoRedirectUri(),
    corsOrigin: getCorsOrigin(),
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}
