'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { startKakaoLogin } from '@/lib/client-auth';
import { ConsentDialog } from './ConsentDialog';

/**
 * KakaoAutofillBanner 컴포넌트 Props
 */
interface KakaoAutofillBannerProps {
  onAutofillComplete?: () => void;
}

/**
 * 카카오 로그인 자동입력 배너 컴포넌트
 * 비로그인 상태에서만 표시되며, 클릭 시 동의 모달 후 카카오 로그인을 진행합니다.
 */
export function KakaoAutofillBanner({ onAutofillComplete }: KakaoAutofillBannerProps) {
  const { isAuthenticated, user } = useAuth();
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  // 로그인한 경우 계정 배지 표시
  if (isAuthenticated && user) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-green-700 font-medium">
            로그인됨 • {user.name}님
          </span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            카카오 계정
          </Badge>
        </AlertDescription>
      </Alert>
    );
  }

  // 비로그인 상태에서 배너 표시
  return (
    <>
      <Alert className="mb-4 border-yellow-200 bg-yellow-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <AlertDescription className="text-yellow-800">
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="h-4 w-4" />
                <span className="font-semibold">빠른 입력을 원하시나요?</span>
              </div>
              <p className="text-sm text-yellow-700">
                카카오 로그인으로 이름, 전화번호를 자동 입력할 수 있습니다.
              </p>
            </AlertDescription>
          </div>
          <Button
            onClick={() => setShowConsentDialog(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold ml-4 whitespace-nowrap"
            size="sm"
          >
            카카오로 빠르게 입력
          </Button>
        </div>
      </Alert>

      <ConsentDialog
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        onConfirm={() => {
          setShowConsentDialog(false);
          startKakaoLogin();
        }}
      />
    </>
  );
}

