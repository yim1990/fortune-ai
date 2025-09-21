import { NextRequest, NextResponse } from 'next/server';

/**
 * 토스페이먼츠 결제 승인 API
 * 클라이언트에서 받은 결제 정보를 토스페이먼츠 서버에 전달하여 결제를 승인합니다.
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { 
          code: 'INVALID_REQUEST',
          message: '필수 파라미터가 누락되었습니다.' 
        },
        { status: 400 }
      );
    }

    // 시크릿 키 가져오기
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { 
          code: 'CONFIGURATION_ERROR',
          message: '서버 설정 오류가 발생했습니다.' 
        },
        { status: 500 }
      );
    }

    // Basic 인증 헤더 생성 (시크릿 키 + ':')
    const authHeader = Buffer.from(`${secretKey}:`).toString('base64');

    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('토스페이먼츠 결제 승인 실패:', data);
      return NextResponse.json(data, { status: response.status });
    }

    // 결제 승인 성공
    console.log('토스페이먼츠 결제 승인 성공:', {
      orderId: data.orderId,
      paymentKey: data.paymentKey,
      status: data.status,
      totalAmount: data.totalAmount,
    });

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('토스페이먼츠 결제 승인 API 오류:', error);
    return NextResponse.json(
      { 
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
