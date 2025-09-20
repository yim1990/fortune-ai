import { cookies } from 'next/headers';
import { createSessionToken, verifySessionToken, type SessionData } from './jwt';
import { KAKAO_OAUTH_SCOPE_STRING, KAKAO_OAUTH_URLS, KAKAO_USER_FIELD_MAPPING } from '../constants/kakao';

/**
 * STATE 쿠키 이름 상수
 */
const STATE_COOKIE_NAME = 'kakao_oauth_state';
const SESSION_COOKIE_NAME = 'fortune_session';

/**
 * 랜덤 STATE 생성
 * CSRF 공격 방지를 위한 상태값 생성
 */
export function generateState(): string {
  return crypto.randomUUID();
}

/**
 * STATE 쿠키 설정
 * HttpOnly, Secure, SameSite=Lax 속성으로 보안 강화
 */
export async function setStateCookie(state: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10분
    path: '/',
  });
}

/**
 * STATE 쿠키에서 값 가져오기
 */
export async function getStateCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(STATE_COOKIE_NAME)?.value;
}

/**
 * STATE 쿠키 삭제
 */
export async function deleteStateCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(STATE_COOKIE_NAME);
}

/**
 * STATE 검증
 * CSRF 공격 방지를 위한 상태값 일치 확인
 */
export function validateState(receivedState: string, storedState: string | undefined): boolean {
  if (!storedState) {
    return false;
  }
  return receivedState === storedState;
}


/**
 * 세션 쿠키 설정
 * HttpOnly, Secure, SameSite=Lax 속성으로 보안 강화
 */
export async function setSessionCookie(sessionData: Partial<SessionData>): Promise<void> {
  const token = createSessionToken(sessionData);
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24시간
    path: '/',
  });
}

/**
 * 세션 쿠키에서 사용자 정보 가져오기
 */
export async function getSessionData(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

/**
 * 세션 쿠키 삭제 (로그아웃)
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * 카카오 OAuth 인증 URL 생성
 * 사용자를 카카오 동의 화면으로 리다이렉트
 */
export function createKakaoAuthUrl(state: string): string {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('KAKAO_CLIENT_ID and KAKAO_REDIRECT_URI environment variables are required');
  }

  const scope = KAKAO_OAUTH_SCOPE_STRING;

  const url = new URL(KAKAO_OAUTH_URLS.AUTHORIZE);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);
  url.searchParams.set('scope', scope);

  // 개발 환경에서만 강제 재인증 요구
  if (process.env.NODE_ENV === 'development') {
    url.searchParams.set('prompt', 'login');
  }

  return url.toString();
}

/**
 * 카카오 액세스 토큰 교환
 * 인증 코드를 액세스 토큰으로 교환
 */
export async function exchangeKakaoToken(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}> {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Kakao OAuth environment variables are required');
  }

  const response = await fetch(KAKAO_OAUTH_URLS.TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kakao token exchange failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * 카카오 사용자 정보 조회
 * 액세스 토큰으로 사용자 프로필 정보 가져오기
 */
export async function getKakaoUserInfo(accessToken: string): Promise<{
  id: number;
  connected_at: string;
  kakao_account: {
    has_email?: boolean;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    has_gender?: boolean;
    gender_needs_agreement?: boolean;
    gender?: 'male' | 'female';
    has_birthday?: boolean;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    has_birthyear?: boolean;
    birthyear_needs_agreement?: boolean;
    birthyear?: string;
    has_phone_number?: boolean;
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
    has_name?: boolean;
    name_needs_agreement?: boolean;
    name?: string;  // 실명
  };
}> {
  const response = await fetch(KAKAO_OAUTH_URLS.USER_INFO, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kakao user info fetch failed: ${response.status} ${errorText}`);
  }

  return response.json();
}
