import { NextRequest, NextResponse } from 'next/server';

/**
 * PHP API 프록시 라우트
 * Next.js 서버에서 PHP API(/api/convert)를 호출하는 프록시 역할
 */

// 요청 스키마 타입 정의
interface ConvertRequest {
  calendar: 'solar' | 'lunar';
  date: string; // YYYY-MM-DD 형식
  time: string; // HH:MM 형식
  gender: 'male' | 'female';
  name: string;
  phone: string;
}

// 응답 스키마 타입 정의
interface ConvertResponse {
  ok: boolean;
  data?: {
    lunar_date: string | null;
    saju: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };
    elements: {
      heavenly_stems: string[];
      earthly_branches: string[];
    };
  };
  code?: string;
  message?: string;
}

/**
 * POST /api/convert-proxy
 * PHP API로 만세력 변환 요청을 프록시하는 엔드포인트
 */
export async function POST(req: NextRequest): Promise<NextResponse<ConvertResponse>> {
  try {
    // 요청 바디 파싱
    const input: ConvertRequest = await req.json();
    
    // PHP API URL 확인
    const phpApiUrl = process.env.PHP_API_URL;
    if (!phpApiUrl) {
      console.error('PHP_API_URL 환경변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { 
          ok: false, 
          code: 'CONFIG_ERROR',
          message: '서버 설정 오류가 발생했습니다.' 
        },
        { status: 500 }
      );
    }

    // PHP API로 요청 전달
    const response = await fetch(`${phpApiUrl}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Fortune-AI-Web/1.0',
      },
      body: JSON.stringify(input),
      cache: 'no-store', // 캐시 비활성화
      signal: AbortSignal.timeout(5000), // 5초 타임아웃
    });

    // 응답 상태 확인
    if (!response.ok) {
      console.error(`PHP API 오류: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { 
          ok: false, 
          code: 'UPSTREAM_ERROR',
          message: '만세력 변환 서비스에 일시적인 문제가 발생했습니다.' 
        },
        { status: 502 }
      );
    }

    // 응답 데이터 파싱
    const data: ConvertResponse = await response.json();
    
    // 성공 응답
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('프록시 요청 오류:', error);

    // 타임아웃 오류 처리
    if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
      return NextResponse.json(
        { 
          ok: false, 
          code: 'TIMEOUT',
          message: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.' 
        },
        { status: 504 }
      );
    }

    // 네트워크 오류 처리
    if (error?.name === 'TypeError' || error?.message?.includes('fetch')) {
      return NextResponse.json(
        { 
          ok: false, 
          code: 'NETWORK_ERROR',
          message: '네트워크 연결에 문제가 발생했습니다.' 
        },
        { status: 502 }
      );
    }

    // JSON 파싱 오류 처리
    if (error?.name === 'SyntaxError' || error?.message?.includes('JSON')) {
      return NextResponse.json(
        { 
          ok: false, 
          code: 'INVALID_REQUEST',
          message: '잘못된 요청 형식입니다.' 
        },
        { status: 400 }
      );
    }

    // 기타 오류 처리
    return NextResponse.json(
      { 
        ok: false, 
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/convert-proxy
 * 프록시 상태 확인 엔드포인트
 */
export async function GET(): Promise<NextResponse> {
  const phpApiUrl = process.env.PHP_API_URL;
  
  if (!phpApiUrl) {
    return NextResponse.json(
      { 
        ok: false, 
        code: 'CONFIG_ERROR',
        message: 'PHP API URL이 설정되지 않았습니다.' 
      },
      { status: 500 }
    );
  }

  try {
    // PHP API 헬스체크
    const response = await fetch(`${phpApiUrl}/healthz`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      return NextResponse.json({
        ok: true,
        message: '프록시 서비스가 정상적으로 작동 중입니다.',
        phpApiUrl: phpApiUrl,
        status: 'healthy'
      });
    } else {
      return NextResponse.json(
        { 
          ok: false, 
          code: 'UPSTREAM_ERROR',
          message: 'PHP API 서비스에 문제가 있습니다.' 
        },
        { status: 502 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        ok: false, 
        code: 'NETWORK_ERROR',
        message: 'PHP API 서비스에 연결할 수 없습니다.' 
      },
      { status: 502 }
    );
  }
}
