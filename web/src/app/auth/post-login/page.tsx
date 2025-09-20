'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 로그인 후 프로필 처리 상태
 */
type ProcessingStatus = 'loading' | 'profile' | 'saving' | 'success' | 'error' | 'reauth_required';

/**
 * 에러 메시지 매핑
 */
const ERROR_MESSAGES: Record<string, string> = {
  profile_failed: '프로필 정보를 가져오는데 실패했습니다.',
  save_failed: '회원 정보 저장에 실패했습니다.',
  reauth_required: '추가 동의가 필요합니다.',
  network_error: '네트워크 오류가 발생했습니다.',
};

/**
 * 로그인 후 프로필 처리 페이지
 * 카카오 프로필 조회 → DB 저장 → 전역 상태 갱신 → 최종 이동
 */
export default function PostLoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  
  const [status, setStatus] = useState<ProcessingStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const maxRetries = 3;

  useEffect(() => {
    processProfile();
  }, []);

  /**
   * 프로필 처리 메인 로직
   */
  const processProfile = async () => {
    try {
      setStatus('loading');
      setError(null);

      // 1. 카카오 프로필 조회
      setStatus('profile');
      const profileResponse = await fetch('/api/auth/kakao/profile');
      
      if (!profileResponse.ok) {
        // 상세한 오류 정보 수집
        const errorText = await profileResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        console.error('Profile fetch failed:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText,
          error: errorData,
          url: profileResponse.url
        });
        
        throw new Error(`profile_failed: ${profileResponse.status} - ${errorData.message || errorText}`);
      }
      
      const profileData = await profileResponse.json();
      
      // needs_agreement가 있으면 재인증 필요
      if (profileData.needs_agreement && Object.values(profileData.needs_agreement).some(Boolean)) {
        setStatus('reauth_required');
        setError('reauth_required');
        return;
      }

      // 2. 회원 정보 저장
      setStatus('saving');
      const saveResponse = await fetch('/api/members/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!saveResponse.ok) {
        // 상세한 오류 정보 수집
        const errorText = await saveResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        console.error('Member save failed:', {
          status: saveResponse.status,
          statusText: saveResponse.statusText,
          error: errorData,
          url: saveResponse.url,
          requestData: profileData
        });
        
        throw new Error(`save_failed: ${saveResponse.status} - ${errorData.message || errorText}`);
      }

      // 3. 전역 상태 갱신
      try {
        await refresh();
      } catch (refreshError) {
        console.error('Auth state refresh failed:', refreshError);
        // 상태 갱신 실패해도 로그인은 성공한 것으로 처리
      }

      // 4. 성공 - 최종 이동
      setStatus('success');
      
      // 잠시 후 사주 입력 페이지로 이동
      setTimeout(() => {
        router.replace('/saju/input');
      }, 1000);

    } catch (error) {
      console.error('Profile processing error:', error);
      setStatus('error');
      setError(error instanceof Error ? error.message : 'network_error');
    }
  };

  /**
   * 재시도 처리
   */
  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      processProfile();
    } else {
      // 최대 재시도 횟수 초과 시 로그인 페이지로 이동
      router.replace('/auth/login?error=max_retries_exceeded');
    }
  };

  /**
   * 재인증 처리
   */
  const handleReauth = () => {
    router.replace('/auth/login?reauth=1');
  };

  /**
   * 수동 입력으로 이동
   */
  const handleManualInput = () => {
    router.replace('/saju/input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">로그인 처리 중</CardTitle>
            <CardDescription>
              프로필 정보를 동기화하고 있습니다
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 진행 상태 표시 */}
            <div className="text-center space-y-4">
              {status === 'loading' && (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <p className="text-gray-600">초기화 중...</p>
                </div>
              )}

              {status === 'profile' && (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <p className="text-gray-600">프로필 정보를 가져오는 중...</p>
                </div>
              )}

              {status === 'saving' && (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <p className="text-gray-600">회원 정보를 저장하는 중...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="flex flex-col items-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <p className="text-gray-600">완료! 잠시 후 이동합니다...</p>
                </div>
              )}

              {status === 'reauth_required' && (
                <div className="flex flex-col items-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                  <p className="text-gray-600">추가 동의가 필요합니다</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex flex-col items-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <p className="text-gray-600">처리 중 오류가 발생했습니다</p>
                </div>
              )}
            </div>

            {/* 에러 메시지 표시 */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {ERROR_MESSAGES[error] || '알 수 없는 오류가 발생했습니다.'}
                </AlertDescription>
              </Alert>
            )}

            {/* 액션 버튼들 */}
            {status === 'reauth_required' && (
              <div className="space-y-2">
                <Button
                  onClick={handleReauth}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  재인증하기
                </Button>
                <Button
                  onClick={handleManualInput}
                  variant="outline"
                  className="w-full"
                >
                  수동으로 입력하기
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-2">
                <Button
                  onClick={handleRetry}
                  disabled={retryCount >= maxRetries}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {retryCount >= maxRetries ? '최대 재시도 횟수 초과' : `다시 시도 (${retryCount}/${maxRetries})`}
                </Button>
                <Button
                  onClick={handleManualInput}
                  variant="outline"
                  className="w-full"
                >
                  수동으로 입력하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
