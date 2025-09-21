'use client';

import { loadTossPayments } from '@tosspayments/payment-sdk';

/**
 * 토스페이먼츠 결제 요청 파라미터 타입
 */
interface TossPaymentParams {
  amount: number;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
}

/**
 * 토스페이먼츠 결제창 열기
 * @param params 결제 요청 파라미터
 */
export async function openTossPayment(params: TossPaymentParams): Promise<void> {
  try {
    // 클라이언트 키 가져오기
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
    }

    // 기본 URL 가져오기
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 토스페이먼츠 SDK 초기화
    const tossPayments = await loadTossPayments(clientKey);

    // 고유한 주문번호 생성 (타임스탬프 + 난수)
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    // 성공/실패 URL 설정
    const successUrl = `${baseUrl}/saju/payment/success?orderId=${orderId}&amount=${params.amount}`;
    const failUrl = `${baseUrl}/saju/payment/fail?orderId=${orderId}`;

    // 결제 요청
    await tossPayments.requestPayment('카드', {
      amount: params.amount,
      orderId,
      orderName: params.orderName,
      successUrl,
      failUrl,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerMobilePhone: params.customerMobilePhone,
    });
  } catch (error) {
    console.error('토스페이먼츠 결제 요청 실패:', error);
    throw error;
  }
}

/**
 * 토스페이먼츠 결제 승인 API 호출
 * @param paymentKey 결제 키
 * @param orderId 주문 ID
 * @param amount 결제 금액
 */
export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<any> {
  try {
    const response = await fetch('/api/toss/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '결제 승인에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('토스페이먼츠 결제 승인 실패:', error);
    throw error;
  }
}
