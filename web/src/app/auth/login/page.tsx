'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { startKakaoLogin } from '@/lib/client-auth';

// 동적 렌더링 강제 설정
export const dynamic = 'force-dynamic';

/**
 * 에러 메시지 매핑
 */
const ERROR_MESSAGES: Record<string, string> = {
  authorization_failed: '인증 요청 중 오류가 발생했습니다. 다시 시도해주세요.',
  user_denied: '로그인이 취소되었습니다.',
  invalid_request: '잘못된 요청입니다. 다시 시도해주세요.',
  invalid_state: '보안 검증에 실패했습니다. 다시 시도해주세요.',
  callback_failed: '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
  token: '토큰 교환 중 오류가 발생했습니다. 다시 시도해주세요.',
};

/**
 * 로그인 폼 컴포넌트 (useSearchParams 사용)
 */
function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL 파라미터에서 에러 메시지 확인
    const errorParam = searchParams.get('error');
    if (errorParam && ERROR_MESSAGES[errorParam]) {
      setError(ERROR_MESSAGES[errorParam]);
    }
  }, [searchParams]);

  /**
   * 카카오 로그인 시작
   * 통일된 진입점 사용
   */
  const handleKakaoLogin = () => {
    startKakaoLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-purple-600 mb-2">
              여우도령 정통사주
            </h1>
          </Link>
          <p className="text-gray-600">
            AI가 해석하는 나만의 정통 사주
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              카카오 계정으로 간편하게 로그인하세요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 에러 메시지 표시 */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 카카오 로그인 버튼 */}
            <Button
              onClick={handleKakaoLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 text-lg"
              size="lg"
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L8.5 21.5c-1.5-1.5-3-3-3-5.5 0-4.521 4.701-8.185 10.5-8.185z"/>
              </svg>
              카카오로 로그인하기
            </Button>

            {/* 서비스 안내 */}
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                로그인 시{' '}
                <Link href="/privacy" className="text-purple-600 hover:underline">
                  개인정보처리방침
                </Link>
                과{' '}
                <Link href="/terms" className="text-purple-600 hover:underline">
                  이용약관
                </Link>
                에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * 카카오 로그인 페이지
 * 사용자가 카카오 OAuth를 통해 로그인할 수 있는 페이지
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
