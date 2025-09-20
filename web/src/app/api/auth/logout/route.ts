import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * 로그아웃 API 엔드포인트
 * 세션 쿠키를 삭제하여 로그아웃 처리
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // 세션 쿠키 삭제
    cookieStore.delete('session');
    
    return NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.',
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '로그아웃 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}