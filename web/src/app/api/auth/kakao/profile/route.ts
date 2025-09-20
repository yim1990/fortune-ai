import { NextRequest } from 'next/server';
import { getSessionData } from '@/lib/auth';

/**
 * 카카오 사용자 프로필 정보 타입 정의
 */
interface KakaoProfileResponse {
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
    name?: string;
  };
}

/**
 * 표준화된 사용자 프로필 정보 타입
 */
interface StandardizedProfile {
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
}

/**
 * 한국 전화번호를 국내 표준 형식으로 정규화
 * +82 10-xxxx-xxxx → 010-xxxx-xxxx
 */
function normalizeKoreanPhone(phoneNumber?: string): string | null {
  if (!phoneNumber) return null;
  
  // +82 10-xxxx-xxxx 형식을 010-xxxx-xxxx로 변환
  const normalized = phoneNumber
    .replace(/^\+82\s*/, '0')  // +82를 0으로 변환
    .replace(/\s+/g, '')       // 공백 제거
    .replace(/-/g, '-');       // 하이픈 유지
  
  // 010-xxxx-xxxx 형식 검증
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  if (phoneRegex.test(normalized)) {
    return normalized;
  }
  
  return null;
}

/**
 * 생년월일을 YYYY-MM-DD 형식으로 변환
 * birthyear: "1990", birthday: "1231" → "1990-12-31"
 */
function formatBirthdate(birthyear?: string, birthday?: string): string | null {
  if (!birthyear || !birthday || birthday.length !== 4) {
    return null;
  }
  
  const month = birthday.slice(0, 2);
  const day = birthday.slice(2, 4);
  
  // 월(01-12), 일(01-31) 유효성 검증
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return null;
  }
  
  return `${birthyear}-${month}-${day}`;
}

/**
 * 성별을 M/F 형식으로 변환
 */
function normalizeGender(gender?: string): 'M' | 'F' | null {
  if (gender === 'male') return 'M';
  if (gender === 'female') return 'F';
  return null;
}

/**
 * 동의가 필요한 항목들을 추출
 */
function extractNeedsAgreement(account: KakaoProfileResponse['kakao_account']) {
  return {
    name: account.name_needs_agreement || false,
    birthdate: account.birthday_needs_agreement || account.birthyear_needs_agreement || false,
    phone: account.phone_number_needs_agreement || false,
    gender: account.gender_needs_agreement || false,
    email: account.email_needs_agreement || false,
  };
}

/**
 * 카카오 사용자 프로필 정보 조회 API
 * 세션에서 액세스 토큰을 가져와 카카오 API를 호출하고 표준화된 데이터를 반환
 */
export async function GET(request: NextRequest) {
  try {
    // 디버깅을 위한 상세 로그
    console.log('Profile API called:', {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      cookies: request.headers.get('cookie'),
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // 세션에서 액세스 토큰 가져오기
    const sessionData = await getSessionData();
    
    console.log('Session data check:', {
      hasSessionData: !!sessionData,
      hasAccessToken: !!sessionData?.accessToken,
      sessionKeys: sessionData ? Object.keys(sessionData) : null,
      timestamp: new Date().toISOString()
    });
    
    if (!sessionData?.accessToken) {
      console.error('No access token found:', {
        sessionData,
        cookies: request.headers.get('cookie'),
        timestamp: new Date().toISOString()
      });
      
      return Response.json(
        { 
          error: 'unauthorized', 
          message: '액세스 토큰이 없습니다.',
          debug: {
            hasSessionData: !!sessionData,
            cookies: request.headers.get('cookie'),
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }

    // 카카오 API 호출
    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionData.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    if (!response.ok) {
      console.error('Kakao profile API error:', response.status, response.statusText);
      
      // 토큰 만료 또는 권한 오류
      if (response.status === 401 || response.status === 403) {
        return Response.json(
          { error: 'token_expired', message: '토큰이 만료되었습니다. 다시 로그인해주세요.' },
          { status: 401 }
        );
      }
      
      return Response.json(
        { error: 'kakao_profile_failed', message: '카카오 프로필 조회에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data: KakaoProfileResponse = await response.json();
    const account = data.kakao_account || {};

    // 생년월일 변환
    const birthdate = formatBirthdate(account.birthyear, account.birthday);
    
    // 전화번호 정규화
    const phone = normalizeKoreanPhone(account.phone_number);
    
    // 성별 변환
    const gender = normalizeGender(account.gender);
    
    // 동의 필요 항목 추출
    const needsAgreement = extractNeedsAgreement(account);

    // 표준화된 프로필 데이터 반환
    const standardizedProfile: StandardizedProfile = {
      kakao_id: String(data.id),
      name: account.name || null,
      birthdate,
      phone,
      gender,
      email: account.email || null,
      needs_agreement: needsAgreement,
    };

    return Response.json(standardizedProfile);

  } catch (error) {
    console.error('Profile API error:', error);
    
    return Response.json(
      { 
        error: 'internal_server_error', 
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      },
      { status: 500 }
    );
  }
}
