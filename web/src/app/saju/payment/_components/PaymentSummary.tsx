'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, Calendar, Phone, MessageSquare } from 'lucide-react';
import { SajuFormData } from '@/contexts/PaymentInputContext';

/**
 * 결제 요약 컴포넌트 Props 타입
 */
interface PaymentSummaryProps {
  formData: SajuFormData | null;
  isReady: boolean;
}

/**
 * 전화번호 마스킹 함수
 * 끝 4자리만 표시하고 나머지는 *로 처리
 */
const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '-';
  if (phoneNumber.length < 4) return phoneNumber;
  return `***-****-${phoneNumber.slice(-4)}`;
};

/**
 * 생년월일시 포맷팅 함수
 */
const formatBirthDateTime = (formData: SajuFormData): string => {
  const { birthYear, birthMonth, birthDay, birthHour, birthHourUnknown } = formData;
  if (!birthYear || !birthMonth || !birthDay) return '-';
  
  const month = birthMonth.padStart(2, '0');
  const day = birthDay.padStart(2, '0');
  
  if (birthHourUnknown || birthHour === 'unknown') {
    return `${birthYear}년 ${month}월 ${day}일 (시간 모름)`;
  }
  
  if (!birthHour) return `${birthYear}년 ${month}월 ${day}일 (시간 모름)`;
  
  const hour = birthHour.padStart(2, '0');
  return `${birthYear}년 ${month}월 ${day}일 ${hour}시`;
};

/**
 * 성별 한글 변환 함수
 */
const formatGender = (gender: string): string => {
  switch (gender) {
    case 'male':
      return '남성';
    case 'female':
      return '여성';
    default:
      return '-';
  }
};

/**
 * 결제 요약 컴포넌트
 * 사용자가 입력한 사주 정보를 요약하여 표시
 */
export default function PaymentSummary({ formData, isReady }: PaymentSummaryProps) {
  if (!formData) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            인적사항 없음
          </CardTitle>
          <CardDescription>
            사주 정보가 입력되지 않았습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              사주 정보 입력 페이지에서 정보를 입력해주세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-600">
          <User className="w-5 h-5 mr-2" />
          인적사항 요약
        </CardTitle>
        <CardDescription>
          입력하신 정보를 확인해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-gray-600">
              <User className="w-4 h-4 mr-2" />
              이름
            </div>
            <div className="text-lg font-semibold">
              {formData.name || '-'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-gray-600">
              성별
            </div>
            <div className="text-lg font-semibold">
              {formatGender(formData.gender)}
            </div>
          </div>
        </div>

        {/* 생년월일시 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            생년월일시
          </div>
          <div className="text-lg font-semibold">
            {formatBirthDateTime(formData)}
          </div>
        </div>

        {/* 전화번호 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            전화번호
          </div>
          <div className="text-lg font-semibold">
            {maskPhoneNumber(formData.phoneNumber)}
          </div>
        </div>

        {/* 궁금한 점 */}
        {formData.question && (
          <div className="space-y-2">
            <div className="flex items-center text-sm font-medium text-gray-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              궁금한 점
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {formData.question}
            </div>
          </div>
        )}

        {/* 유효성 검사 결과 */}
        {!isReady && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              필수 정보가 부족합니다. 모든 필수 항목을 입력해주세요.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
