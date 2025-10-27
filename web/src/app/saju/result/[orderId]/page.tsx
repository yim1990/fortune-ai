'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';

/**
 * 사주 결과 페이지 (임시)
 * 결제 완료 후 표시되는 임시 결과 페이지입니다.
 * 실제 사주 결과 생성은 T-029에서 구현될 예정입니다.
 */
export default function SajuResultPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    if (params.orderId) {
      setOrderId(params.orderId as string);
      // 3초 후 로딩 완료 (실제로는 사주 결과 생성 시간)
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [params.orderId]);

  /**
   * 홈으로 돌아가기
   */
  const handleBackToHome = () => {
    router.push('/');
  };

  /**
   * 새로운 사주 보기
   */
  const handleNewSaju = () => {
    router.push('/saju/input');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl">
                <Loader2 className="w-8 h-8 mr-2 animate-spin text-purple-600" />
                사주 결과 생성 중...
              </CardTitle>
              <CardDescription>
                AI가 당신의 사주를 분석하고 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
                <p className="text-sm text-gray-500">
                  잠시만 기다려주세요. 곧 완성됩니다!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            🦊 사주 결과
          </h1>
          <p className="text-gray-600">
            당신의 운명을 AI가 분석했습니다
          </p>
        </div>

        {/* 결과 카드 */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-600">
              <CheckCircle className="w-6 h-6 mr-2" />
              결제 완료
            </CardTitle>
            <CardDescription>
              사주 해석이 성공적으로 완료되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                주문번호 <strong>{orderId}</strong>의 사주 해석이 완료되었습니다.
              </AlertDescription>
            </Alert>

            {/* 임시 결과 표시 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🦊</div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                여우도령 정통사주
              </h3>
              <p className="text-gray-600 mb-4">
                AI가 분석한 당신의 운명이 준비되었습니다.
              </p>
              <div className="text-sm text-gray-500">
                실제 사주 결과는 T-029에서 구현될 예정입니다.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex space-x-4">
          <Button 
            onClick={handleNewSaju}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            새로운 사주 보기
          </Button>
          <Button 
            onClick={handleBackToHome}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>결제가 완료되었습니다. 감사합니다! 🙏</p>
          <p className="mt-1">문의사항이 있으시면 고객센터로 연락해주세요.</p>
        </div>
      </div>
    </div>
  );
}
