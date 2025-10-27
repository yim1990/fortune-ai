'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';

/**
 * 결제 실패 처리 컴포넌트 (useSearchParams 사용)
 */
function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL 파라미터에서 에러 정보 추출
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  /**
   * 에러 메시지 포맷팅
   */
  const getErrorMessage = (): string => {
    if (message) {
      return message;
    }
    
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자에 의해 결제가 취소되었습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 처리 중 오류가 발생했습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드 정보에 문제가 있습니다. 카드 정보를 확인해주세요.';
      case 'INVALID_REQUEST':
        return '잘못된 결제 요청입니다.';
      default:
        return '결제 처리 중 문제가 발생했습니다.';
    }
  };

  /**
   * 결제 페이지로 돌아가기
   */
  const handleBackToPayment = () => {
    router.push('/saju/payment');
  };

  /**
   * 홈으로 돌아가기
   */
  const handleBackToHome = () => {
    router.push('/');
  };

  /**
   * 새로고침하여 재시도
   */
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl text-red-600">
              <XCircle className="w-8 h-8 mr-2" />
              결제 실패
            </CardTitle>
            <CardDescription>
              결제 처리 중 문제가 발생했습니다.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 에러 메시지 */}
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage()}
              </AlertDescription>
            </Alert>

            {/* 주문 정보 */}
            {orderId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">
                  <strong>주문번호:</strong> {orderId}
                </div>
                {code && (
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>에러 코드:</strong> {code}
                  </div>
                )}
              </div>
            )}

            {/* 안내 메시지 */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 카드 정보를 다시 확인해주세요</p>
              <p>• 카드 한도를 확인해주세요</p>
              <p>• 다른 결제 수단을 시도해보세요</p>
              <p>• 문제가 지속되면 고객센터로 문의해주세요</p>
            </div>

            {/* 액션 버튼들 */}
            <div className="space-y-2">
              <Button 
                onClick={handleBackToPayment}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 결제하기
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1"
                >
                  새로고침
                </Button>
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  홈으로
                </Button>
              </div>
            </div>

            {/* 고객센터 안내 */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t">
              <p>문의사항이 있으시면 고객센터로 연락해주세요</p>
              <p className="font-medium">고객센터: 1588-0000</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * 결제 실패 페이지 (Suspense로 감싸기)
 */
export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-8 px-4">
        <Card className="shadow-lg max-w-md w-full">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}
