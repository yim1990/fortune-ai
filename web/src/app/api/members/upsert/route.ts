import { NextRequest } from 'next/server';
import { createSupabaseAdmin, assertServerAuth } from '@/lib/supabase/admin';
import { validateMemberData } from '@/lib/validation/member';
import { MemberUpsertData, MemberResponse } from '@/types/member';

/**
 * 회원 정보 Upsert API
 * 카카오 ID를 기준으로 회원 정보를 생성하거나 업데이트
 */
export async function POST(request: NextRequest) {
  try {
    // 서버 사이드 실행 확인
    assertServerAuth();

    // 요청 본문 파싱
    const body: MemberUpsertData = await request.json();

    // 입력 데이터 유효성 검증
    const validation = validateMemberData(body);
    if (!validation.isValid) {
      return Response.json(
        {
          success: false,
          error: 'validation_failed',
          details: validation.errors,
        } as MemberResponse,
        { status: 400 }
      );
    }

    // Supabase 관리자 클라이언트 생성
    const supabase = createSupabaseAdmin();

    // 현재 시간을 ISO 8601 형식으로 설정
    const now = new Date().toISOString();

    // Upsert 데이터 준비
    const upsertData = {
      ...body,
      last_login_at: now,
    };

    // 카카오 ID로 upsert 실행
    const { data, error } = await supabase
      .from('members')
      .upsert(upsertData, { 
        onConflict: 'kakao_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Member upsert error:', error);
      return Response.json(
        {
          success: false,
          error: 'db_upsert_failed',
          message: '회원 정보 저장에 실패했습니다.',
        } as MemberResponse,
        { status: 500 }
      );
    }

    // 성공 응답
    return Response.json({
      success: true,
      member: data,
    } as MemberResponse);

  } catch (error) {
    console.error('Member upsert API error:', error);
    
    return Response.json(
      {
        success: false,
        error: 'internal_server_error',
        message: '서버 오류가 발생했습니다.',
      } as MemberResponse,
      { status: 500 }
    );
  }
}

/**
 * 회원 정보 조회 API (카카오 ID로)
 */
export async function GET(request: NextRequest) {
  try {
    // 서버 사이드 실행 확인
    assertServerAuth();

    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakao_id');

    if (!kakaoId) {
      return Response.json(
        {
          success: false,
          error: 'missing_kakao_id',
          message: '카카오 ID가 필요합니다.',
        } as MemberResponse,
        { status: 400 }
      );
    }

    // Supabase 관리자 클라이언트 생성
    const supabase = createSupabaseAdmin();

    // 카카오 ID로 회원 정보 조회
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('kakao_id', kakaoId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 회원을 찾을 수 없음
        return Response.json(
          {
            success: false,
            error: 'member_not_found',
            message: '회원 정보를 찾을 수 없습니다.',
          } as MemberResponse,
          { status: 404 }
        );
      }

      console.error('Member fetch error:', error);
      return Response.json(
        {
          success: false,
          error: 'db_fetch_failed',
          message: '회원 정보 조회에 실패했습니다.',
        } as MemberResponse,
        { status: 500 }
      );
    }

    // 성공 응답
    return Response.json({
      success: true,
      member: data,
    } as MemberResponse);

  } catch (error) {
    console.error('Member fetch API error:', error);
    
    return Response.json(
      {
        success: false,
        error: 'internal_server_error',
        message: '서버 오류가 발생했습니다.',
      } as MemberResponse,
      { status: 500 }
    );
  }
}
