'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * 동의 다이얼로그 컴포넌트 Props
 */
interface ConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * 카카오 로그인 자동입력 동의 다이얼로그
 */
export function ConsentDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ConsentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            카카오 로그인으로 빠르게 입력하세요
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            카카오 계정 정보를 사용하여 다음 정보를 자동으로 입력합니다:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              이름, 전화번호는 자동으로 입력되지만 언제든 수정하실 수 있습니다.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">이름</span>
              <span className="font-medium">자동 입력</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">전화번호</span>
              <span className="font-medium">자동 입력</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">생년월일시</span>
              <span className="font-medium text-gray-500">직접 입력</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">궁금한 점</span>
              <span className="font-medium text-gray-500">직접 입력</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            로그인 후에도 모든 정보는 수정 가능합니다.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            {isLoading ? '처리 중...' : '동의 및 로그인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

