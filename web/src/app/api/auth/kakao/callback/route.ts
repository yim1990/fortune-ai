import { NextRequest, NextResponse } from 'next/server';
import { 
  getStateCookie, 
  deleteStateCookie, 
  validateState, 
  exchangeKakaoToken, 
  getKakaoUserInfo, 
  setSessionCookie 
} from '@/lib/auth';
import { createSupabaseAdmin, assertServerAuth } from '@/lib/supabase/admin';
import { validateMemberData } from '@/lib/validation/member';
import { getBaseUrl } from '@/lib/env';

/**
 * 카카오 OAuth 콜백 처리
 * 인증 코드를 액세스 토큰으로 교환하고 세션 설정
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  try {
    // 에러 파라미터가 있는 경우 (사용자가 동의 거부 등)
    if (error) {
      console.error('Kakao OAuth error:', error);
      return Response.redirect(
        new URL('/auth/login?error=user_denied', getBaseUrl()),
        302
      );
    }

    // 필수 파라미터 검증
    if (!code || !state) {
      console.error('Missing required parameters: code or state');
      return Response.redirect(
        new URL('/auth/login?error=invalid_request', getBaseUrl()),
        302
      );
    }

    // 저장된 STATE 가져오기
    const storedState = await getStateCookie();
    
    // STATE 검증 (CSRF 방지)
    if (!validateState(state, storedState)) {
      console.error('Invalid state parameter');
      return Response.redirect(
        new URL('/auth/login?error=invalid_state', getBaseUrl()),
        302
      );
    }

    // STATE 쿠키 삭제 (일회성 사용)
    await deleteStateCookie();

    // 카카오 액세스 토큰 교환 (서버의 HOST 값 사용)
    const tokenData = await exchangeKakaoToken(code);
    
    // 카카오 사용자 정보 조회
    const userInfo = await getKakaoUserInfo(tokenData.access_token);

    // 세션 데이터 설정 (실명 사용)
    const sessionData = {
      accessToken: tokenData.access_token,
      kakaoId: userInfo.id.toString(),
      name: userInfo.kakao_account.name, // 실명
      email: userInfo.kakao_account.email,
      gender: userInfo.kakao_account.gender,
      birthday: userInfo.kakao_account.birthday,
      birthyear: userInfo.kakao_account.birthyear,
      phoneNumber: userInfo.kakao_account.phone_number,
    };

    // 회원 정보를 데이터베이스에 저장/업데이트
    try {
      // 서버 사이드 실행 확인
      assertServerAuth();
      
      // 생년월일 변환 (birthyear + birthday -> YYYY-MM-DD)
      let birthdate = null;
      if (userInfo.kakao_account.birthyear && userInfo.kakao_account.birthday) {
        const month = userInfo.kakao_account.birthday.slice(0, 2);
        const day = userInfo.kakao_account.birthday.slice(2, 4);
        birthdate = `${userInfo.kakao_account.birthyear}-${month}-${day}`;
      }
      
      // 성별 변환 (male/female -> M/F)
      let gender = null;
      if (userInfo.kakao_account.gender === 'male') gender = 'M';
      if (userInfo.kakao_account.gender === 'female') gender = 'F';
      
      // 회원 정보 데이터 준비
      const memberData = {
        kakao_id: userInfo.id.toString(),
        name: userInfo.kakao_account.name,
        birthdate,
        phone: userInfo.kakao_account.phone_number,
        gender,
        consent_personal_info: true, // 카카오 로그인 시 동의한 것으로 간주
      };
      
      // 데이터 유효성 검증
      const validation = validateMemberData(memberData);
      if (!validation.isValid) {
        // 유효성 검증 실패해도 로그인은 진행 (부분 정보로 저장)
      }
      
      // Supabase에 회원 정보 저장/업데이트
      const supabase = createSupabaseAdmin();
      const now = new Date().toISOString();
      
      const { error: upsertError } = await supabase
        .from('members')
        .upsert({
          ...memberData,
          last_login_at: now,
        }, { 
          onConflict: 'kakao_id',
          ignoreDuplicates: false 
        });
      
      if (upsertError) {
        console.error('Member upsert error:', upsertError);
        // DB 저장 실패해도 로그인은 진행
      }
      
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      // DB 오류가 발생해도 로그인은 진행
    }

    // 로그인 성공 후 post-login 페이지로 리다이렉트 (프로필 처리 후 최종 이동)
    const response = NextResponse.redirect(
      new URL('/auth/post-login', getBaseUrl()),
      302
    );
    
    // 쿠키를 직접 설정 (setSessionCookie 함수 사용)
    await setSessionCookie(sessionData);
    
    return response;

  } catch (error) {
    console.error('Kakao OAuth callback error:', error);
    
    // 에러 발생 시 로그인 페이지로 리다이렉트
    return NextResponse.redirect(
      new URL('/auth/login?error=callback_failed', getBaseUrl()),
      302
    );
  }
}
