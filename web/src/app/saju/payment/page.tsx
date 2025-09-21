'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentInput } from '@/contexts/PaymentInputContext';
import PaymentSummary from './_components/PaymentSummary';
import PayCTA from './_components/PayCTA';
import { openTossPayment } from './_lib/toss';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * 결제 페이지
 * 사주 입력 정보를 요약하고 결제를 진행하는 페이지
 */
export default function PaymentPage() {
  const router = useRouter();
  const { loading, isAuthenticated, initialized } = useAuth();
  const { formData, isReady, clearFormData } = usePaymentInput();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 인증 상태 확인 및 리다이렉트 처리
   */
  useEffect(() => {
    if (!initialized || loading) return;

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // 폼 데이터가 없는 경우 입력 페이지로 리다이렉트
    if (!formData) {
      router.push('/saju/input');
      return;
    }
  }, [initialized, loading, isAuthenticated, formData, router]);

  /**
   * 결제 처리 함수
   * 토스페이먼츠 결제창을 열어 결제를 진행합니다.
   */
  const handlePayment = async () => {
    if (!isReady || isProcessing || !formData) return;

    setIsProcessing(true);
    
    try {
      // 토스페이먼츠 결제 요청
      await openTossPayment({
        amount: 29800,
        orderName: '연화당 정통사주 1회',
        customerName: formData.name,
        customerEmail: '', // 이메일은 선택사항
        customerMobilePhone: formData.phoneNumber,
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 뒤로가기 처리
   */
  const handleGoBack = () => {
    router.back();
  };

  // 로딩 중
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-4">결제를 진행하려면 먼저 로그인해주세요.</p>
          <Button asChild>
            <Link href="/auth/login">로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 폼 데이터가 없는 경우
  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">사주 정보가 없습니다</h1>
          <p className="text-gray-600 mb-4">결제를 진행하려면 먼저 사주 정보를 입력해주세요.</p>
          <Button asChild>
            <Link href="/saju/input">사주 정보 입력하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              뒤로가기
            </Button>
            <h1 className="text-3xl font-bold text-purple-600 text-center flex-1">
              결제 준비
            </h1>
            <div className="w-20"></div> {/* 균형을 위한 빈 공간 */}
          </div>
          
          <p className="text-center text-gray-600">
            입력하신 정보를 확인하고 안전하게 결제해주세요
          </p>
        </div>

        {/* 인적사항 요약 */}
        <div className="mb-6">
          <PaymentSummary formData={formData} isReady={isReady} />
        </div>

        {/* 결제 CTA */}
        <div className="mb-6">
          <PayCTA 
            isReady={isReady} 
            onPaymentClick={handlePayment}
            isProcessing={isProcessing}
          />
        </div>

        {/* 추가 안내 */}
        <div className="text-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              결제 후에는 입력하신 정보를 바꿀 수 없습니다. 
              정보를 다시 확인해주세요.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
