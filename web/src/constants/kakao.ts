/**
 * 카카오 OAuth 관련 상수 정의
 */

/**
 * 카카오 OAuth 요청 스코프 목록
 * 사용자 정보 수집을 위한 권한 범위
 */
export const KAKAO_OAUTH_SCOPES = [
  'account_email',    // 이메일 주소
  'name',             // 이름 (실명)
  'gender',           // 성별
  'birthyear',        // 출생연도
  'birthday',         // 생년월일
  'phone_number'      // 전화번호
] as const;

/**
 * 카카오 OAuth 스코프를 공백으로 구분된 문자열로 변환
 */
export const KAKAO_OAUTH_SCOPE_STRING = KAKAO_OAUTH_SCOPES.join(' ');

/**
 * 카카오 사용자 정보 필드명 매핑
 * 카카오 API 응답 필드명과 내부 사용 필드명 매핑
 */
export const KAKAO_USER_FIELD_MAPPING = {
  // 기본 정보
  ID: 'id',
  CONNECTED_AT: 'connected_at',
  
  // 계정 정보
  EMAIL: 'email',                 // 이메일
  GENDER: 'gender',               // 성별
  BIRTHDAY: 'birthday',           // 생년월일
  BIRTHYEAR: 'birthyear',         // 출생연도
  PHONE_NUMBER: 'phone_number',   // 전화번호
  
  // 실명 정보
  NAME: 'name'                    // 실명
} as const;

/**
 * 카카오 OAuth 관련 URL 상수
 */
export const KAKAO_OAUTH_URLS = {
  AUTHORIZE: 'https://kauth.kakao.com/oauth/authorize',
  TOKEN: 'https://kauth.kakao.com/oauth/token',
  USER_INFO: 'https://kapi.kakao.com/v2/user/me'
} as const;
