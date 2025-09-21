'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { confirmTossPayment } from '../_lib/toss';

/**
 * 결제 성공 페이지
 * 토스페이먼츠 결제 성공 후 결제 승인을 처리하고 결과 페이지로 리다이렉트합니다.
 */
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paymentData, setPaymentData] = useState<any>(null);

  // URL 파라미터에서 결제 정보 추출
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      setErrorMessage('결제 정보가 올바르지 않습니다.');
      return;
    }

    // 결제 승인 처리
    handlePaymentConfirmation();
  }, [paymentKey, orderId, amount]);

  /**
   * 결제 승인 처리
   */
  const handlePaymentConfirmation = async () => {
    try {
      setStatus('loading');

      // 토스페이먼츠 결제 승인 API 호출
      const result = await confirmTossPayment(
        paymentKey!,
        orderId!,
        Number(amount!)
      );

      // 결제 승인 성공
      setPaymentData(result);
      setStatus('success');

      // 2초 후 결과 페이지로 리다이렉트
      setTimeout(() => {
        router.replace(`/saju/result/${orderId}`);
      }, 2000);

    } catch (error) {
      console.error('결제 승인 실패:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : '결제 승인 중 오류가 발생했습니다.'
      );
    }
  };

  /**
   * 다시 시도 처리
   */
  const handleRetry = () => {
    handlePaymentConfirmation();
  };

  /**
   * 결제 페이지로 돌아가기
   */
  const handleBackToPayment = () => {
    router.push('/saju/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl">
              {status === 'loading' && <Loader2 className="w-8 h-8 mr-2 animate-spin text-blue-600" />}
              {status === 'success' && <CheckCircle className="w-8 h-8 mr-2 text-green-600" />}
              {status === 'error' && <AlertCircle className="w-8 h-8 mr-2 text-red-600" />}
              {status === 'loading' && '결제 처리 중...'}
              {status === 'success' && '결제 완료!'}
              {status === 'error' && '결제 처리 실패'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && '결제 승인을 처리하고 있습니다. 잠시만 기다려주세요.'}
              {status === 'success' && '결제가 성공적으로 완료되었습니다.'}
              {status === 'error' && '결제 처리 중 문제가 발생했습니다.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 로딩 상태 */}
            {status === 'loading' && (
              <div className="text-center">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}

            {/* 성공 상태 */}
            {status === 'success' && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    결제가 성공적으로 완료되었습니다. 
                    잠시 후 사주 결과 페이지로 이동합니다.
                  </AlertDescription>
                </Alert>

                {paymentData && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>주문번호:</strong> {paymentData.orderId}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>결제금액:</strong> {paymentData.totalAmount?.toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>결제수단:</strong> {paymentData.method}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 에러 상태 */}
            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleRetry}
                    className="flex-1"
                    variant="outline"
                  >
                    다시 시도
                  </Button>
                  <Button 
                    onClick={handleBackToPayment}
                    className="flex-1"
                  >
                    결제 페이지로
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
