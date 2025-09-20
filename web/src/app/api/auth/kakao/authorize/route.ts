import { NextRequest } from 'next/server';
import { generateState, setStateCookie, createKakaoAuthUrl } from '@/lib/auth';
import { getBaseUrl } from '@/lib/env';

/**
 * 카카오 OAuth 인증 시작
 * 사용자를 카카오 동의 화면으로 리다이렉트
 */
export async function GET(request: NextRequest) {
  try {
    // CSRF 방지를 위한 STATE 생성
    const state = generateState();
    
    // STATE를 쿠키에 저장
    await setStateCookie(state);
    
    // 카카오 OAuth URL 생성 (서버의 HOST 값 사용)
    const authUrl = createKakaoAuthUrl(state);
    
    // 카카오 동의 화면으로 리다이렉트
    return Response.redirect(authUrl, 302);
    
  } catch (error) {
    console.error('Kakao OAuth authorization error:', error);
    
    // 에러 발생 시 로그인 페이지로 리다이렉트
    return Response.redirect(
      new URL('/auth/login?error=authorization_failed', getBaseUrl()),
      302
    );
  }
}
