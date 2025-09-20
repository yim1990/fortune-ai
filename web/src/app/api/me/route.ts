import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/jwt';
import { createSupabaseAdmin, assertServerAuth } from '@/lib/supabase/admin';
import { getSessionData } from '@/lib/auth';

/**
 * 현재 사용자 정보 조회 API
 * 세션 토큰을 확인하고 멤버 정보를 반환
 */
export async function GET(request: NextRequest) {
  try {
    // 서버 사이드에서만 실행 가능
    assertServerAuth();

    // 세션 데이터 가져오기
    const sessionData = await getSessionData();
    
    if (!sessionData) {
      return NextResponse.json({
        success: false,
        user: null,
        message: 'No session found',
      }, { status: 401 });
    }

    // Supabase 클라이언트 초기화
    const supabase = createSupabaseAdmin();

    // 카카오 ID로 멤버 정보 조회
    const { data: members, error } = await supabase
      .from('members')
      .select('*')
      .eq('kakao_id', sessionData.kakaoId);

    if (error) {
      console.error('Member fetch error:', error);
      return NextResponse.json({
        success: false,
        user: null,
        message: 'Failed to fetch member data',
      }, { status: 500 });
    }

    // 멤버가 존재하지 않는 경우 (정상적인 비즈니스 로직)
    if (!members || members.length === 0) {
      return NextResponse.json({
        success: true,
        user: null,
        message: 'Member not registered. Please complete registration first.',
        requiresRegistration: true,
      }, { status: 200 });
    }

    const member = members[0];

    // 멤버 정보를 표준화된 사용자 객체로 변환
    const user = {
      id: member.id,
      kakao_id: member.kakao_id,
      name: member.name,
      birthdate: member.birthdate,
      phone: member.phone,
      gender: member.gender,
      consent_personal_info: member.consent_personal_info,
      last_login_at: member.last_login_at,
      created_at: member.created_at,
      updated_at: member.updated_at,
    };

    return NextResponse.json({
      success: true,
      user,
      message: 'User data retrieved successfully',
    });

  } catch (error) {
    console.error('Me API error:', error);
    
    return NextResponse.json({
      success: false,
      user: null,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
