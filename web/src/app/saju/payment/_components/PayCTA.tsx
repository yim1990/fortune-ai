'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * 결제 CTA 컴포넌트 Props 타입
 */
interface PayCTAProps {
  isReady: boolean;
  onPaymentClick: () => void;
  isProcessing?: boolean;
}

/**
 * 결제 CTA 컴포넌트
 * 결제 금액 표시 및 결제 버튼을 제공
 */
export default function PayCTA({ isReady, onPaymentClick, isProcessing = false }: PayCTAProps) {
  const handlePaymentClick = () => {
    if (!isReady || isProcessing) return;
    onPaymentClick();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <CreditCard className="w-5 h-5 mr-2" />
          결제 정보
        </CardTitle>
        <CardDescription>
          안전하고 간편한 결제를 진행해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 결제 금액 */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <span className="text-lg font-medium text-gray-700">결제 금액</span>
          <span className="text-2xl font-bold text-purple-600">29,800원</span>
        </div>

        {/* 결제 방법 안내 */}
        <div className="text-sm text-gray-600 space-y-2">
          <p>• 토스페이먼츠를 통한 안전한 결제</p>
          <p>• 카드, 계좌이체, 간편결제 지원</p>
          <p>• 결제 완료 후 즉시 사주 결과 확인 가능</p>
        </div>

        {/* 결제 버튼 */}
        <Button
          onClick={handlePaymentClick}
          disabled={!isReady || isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              처리 중...
            </div>
          ) : (
            '토스페이먼츠로 결제하기'
          )}
        </Button>

        {/* 안내 메시지 */}
        {!isReady && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              인적사항이 부족합니다.{' '}
              <Link 
                href="/saju/input" 
                className="underline hover:text-red-700 font-medium"
              >
                입력 페이지
              </Link>
              로 이동하여 필수 정보를 입력해주세요.
            </AlertDescription>
          </Alert>
        )}

        {/* 보안 안내 */}
        <div className="text-xs text-gray-500 text-center">
          <p>• 개인정보는 암호화되어 안전하게 처리됩니다</p>
          <p>• 결제 정보는 토스페이먼츠에서 관리됩니다</p>
        </div>
      </CardContent>
    </Card>
  );
}
