import { NextRequest } from 'next/server';
import { getSessionData } from '@/lib/auth';

/**
 * 세션 상태 확인 API
 * 클라이언트에서 현재 로그인 상태를 확인할 수 있는 엔드포인트
 */
export async function GET(request: NextRequest) {
  try {
    // 세션 데이터 가져오기
    const sessionData = await getSessionData();
    
    if (!sessionData) {
      return Response.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    // 사용자 정보 반환 (민감한 정보는 제외)
    return Response.json({
      isAuthenticated: true,
      user: {
        kakaoId: sessionData.kakaoId,
        name: sessionData.name,
        email: sessionData.email,
        gender: sessionData.gender,
        birthday: sessionData.birthday,
        birthyear: sessionData.birthyear,
        phoneNumber: sessionData.phoneNumber,
      },
    });
    
  } catch (error) {
    console.error('Session check error:', error);
    
    return Response.json(
      { isAuthenticated: false, error: 'Session check failed' },
      { status: 500 }
    );
  }
}
