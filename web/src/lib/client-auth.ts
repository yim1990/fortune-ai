/**
 * 클라이언트 사이드에서 사용할 수 있는 인증 관련 유틸리티 함수들
 * 서버 사이드 전용 함수들은 제외하고 클라이언트에서 안전하게 사용할 수 있는 함수들만 포함
 */

/**
 * 카카오 로그인 시작
 * 카카오 OAuth 인증 URL로 리다이렉트
 */
export function startKakaoLogin(): void {
  window.location.href = '/api/auth/kakao/authorize';
}

/**
 * 로그아웃 처리
 * 로그아웃 API를 호출하여 세션을 삭제
 */
export async function logout(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || '로그아웃에 실패했습니다.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: '로그아웃 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 사용자 세션 확인
 * 클라이언트에서 세션 상태를 확인하기 위한 API 호출
 */
export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: {
    kakaoId: string;
    name: string;        // 실명
    email?: string;
    gender?: 'male' | 'female';
    birthday?: string;
    birthyear?: string;
    phoneNumber?: string;
  };
}> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.user,
      };
    } else {
      return {
        isAuthenticated: false,
      };
    }
  } catch (error) {
    console.error('Session check error:', error);
    return {
      isAuthenticated: false,
    };
  }
}

/**
 * 카카오 프로필 정보 조회
 * 표준화된 사용자 프로필 정보를 가져오는 API 호출
 */
export async function getKakaoProfile(): Promise<{
  success: boolean;
  data?: {
    kakao_id: string;
    name: string | null;
    birthdate: string | null;
    phone: string | null;
    gender: 'M' | 'F' | null;
    email: string | null;
    needs_agreement: {
      name?: boolean;
      birthdate?: boolean;
      phone?: boolean;
      gender?: boolean;
      email?: boolean;
    };
  };
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/kakao/profile', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || '프로필 조회에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
}

/**
 * 회원 정보 저장/업데이트
 * 카카오 프로필 정보를 데이터베이스에 저장
 */
export async function upsertMember(memberData: {
  kakao_id: string;
  name?: string | null;
  birthdate?: string | null;
  phone?: string | null;
  gender?: 'M' | 'F' | null;
  consent_personal_info?: boolean;
}): Promise<{
  success: boolean;
  member?: any;
  error?: string;
}> {
  try {
    const response = await fetch('/api/members/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(memberData),
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        member: data.member,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || '회원 정보 저장에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('Member upsert error:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
}

/**
 * 회원 정보 조회
 * 카카오 ID로 회원 정보를 조회
 */
export async function getMember(kakaoId: string): Promise<{
  success: boolean;
  member?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/members/upsert?kakao_id=${kakaoId}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        member: data.member,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || '회원 정보 조회에 실패했습니다.',
      };
    }
  } catch (error) {
    console.error('Member fetch error:', error);
    return {
      success: false,
      error: '네트워크 오류가 발생했습니다.',
    };
  }
}

