'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, User, Calendar, Phone, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentInput } from '@/contexts/PaymentInputContext';
import { getKakaoProfile } from '@/lib/client-auth';
import { KakaoAutofillBanner } from './_components/KakaoAutofillBanner';
import { mapKakaoProfileToForm } from './_lib/map-kakao-profile';

// UserInfo 타입은 이제 useAuth에서 제공하는 Member 타입을 사용

/**
 * 사주 입력 폼 데이터 타입
 */
interface SajuFormData {
  name: string;
  gender: 'male' | 'female' | '';
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthHourUnknown: boolean;
  phoneNumber: string;
  question: string;
}

/**
 * 사주 입력 페이지
 * 사용자가 생년월일시와 개인정보를 입력하는 페이지
 */
export default function SajuInputPage() {
  const router = useRouter();
  const { loading, isAuthenticated, user, initialized, logout: authLogout } = useAuth();
  const { setFormData: setPaymentFormData } = usePaymentInput();
  const [profileData, setProfileData] = useState<any>(null);
  const [needsAgreement, setNeedsAgreement] = useState<any>(null);
  const [formData, setFormData] = useState<SajuFormData>({
    name: '',
    gender: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    birthHourUnknown: false,
    phoneNumber: '',
    question: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // 초기화가 완료되지 않았으면 아무것도 하지 않음
    if (!initialized) {
      return;
    }

    // 로그인한 경우에만 사용자 정보 가져오기
    // 비로그인 사용자도 이 페이지를 사용할 수 있도록 변경 (T-030)
    if (isAuthenticated && user) {
      const loadKakaoProfile = async () => {
        const profileResult = await getKakaoProfile();
        
        if (profileResult.success && profileResult.data) {
          setProfileData(profileResult.data);
          setNeedsAgreement(profileResult.data.needs_agreement);
          
          // 카카오 프로필을 폼 데이터로 매핑 (T-031: 자동입력)
          const mappedData = mapKakaoProfileToForm(profileResult.data, formData);
          
          // 기존 값이 있는 경우 유지, 없는 경우만 새 값으로 채움
          setFormData(prev => ({
            ...prev,
            name: mappedData.name || prev.name || '',
            gender: mappedData.gender || prev.gender || '',
            phoneNumber: mappedData.phoneNumber || prev.phoneNumber || '',
            birthYear: mappedData.birthYear || prev.birthYear || '',
            birthMonth: mappedData.birthMonth || prev.birthMonth || '',
            birthDay: mappedData.birthDay || prev.birthDay || '',
          }));
        } else {
          // 프로필 조회 실패 시 기본 정보만 사용
          setFormData(prev => ({
            ...prev,
            name: user.name || prev.name || '',
            phoneNumber: user.phone || prev.phoneNumber || '',
          }));
        }
      };

      loadKakaoProfile();
    }
  }, [loading, isAuthenticated, initialized, user, router]);

  /**
   * 전화번호 자동 포맷팅 함수
   * 숫자만 입력해도 010-1234-5678 형식으로 자동 변환
   */
  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 11자리를 초과하면 11자리까지만 사용
    const truncated = numbers.slice(0, 11);
    
    // 포맷팅
    if (truncated.length <= 3) {
      return truncated;
    } else if (truncated.length <= 7) {
      return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
    } else {
      return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
    }
  };

  /**
   * 폼 입력값 변경 처리
   */
  const handleInputChange = (field: keyof SajuFormData, value: string | boolean) => {
    // 전화번호 입력 시 자동 포맷팅 적용
    if (field === 'phoneNumber' && typeof value === 'string') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * 출생시간 모름 체크박스 처리
   */
  const handleBirthHourUnknownChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      birthHourUnknown: checked,
      birthHour: checked ? '' : prev.birthHour,
    }));

    // 에러 메시지 초기화
    if (errors.birthHour) {
      setErrors(prev => ({
        ...prev,
        birthHour: undefined,
      }));
    }
  };

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
    }

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birthYear = '생년월일을 모두 입력해주세요.';
    }

    if (!formData.birthHourUnknown && !formData.birthHour) {
      newErrors.birthHour = '출생시간을 선택하거나 "모름"을 체크해주세요.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '전화번호를 입력해주세요.';
    } else {
      // 숫자만 추출해서 11자리인지 확인
      const numbers = formData.phoneNumber.replace(/[^\d]/g, '');
      if (numbers.length !== 11 || !numbers.startsWith('010')) {
        newErrors.phoneNumber = '올바른 전화번호를 입력해주세요. (예: 01012345678 또는 010-1234-5678)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      await authLogout();
      // 로그아웃 성공 시 로그인 페이지로 리다이렉트
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * 폼 제출 처리
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 출생시간이 비어있으면 "모름"으로 처리
    const processedFormData = {
      ...formData,
      birthHour: formData.birthHourUnknown || !formData.birthHour ? 'unknown' : formData.birthHour,
    };

    // 결제 컨텍스트에 폼 데이터 저장 (기존 방식 유지)
    setPaymentFormData(processedFormData);
    
    // sessionStorage에도 백업 저장
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sajuInput', JSON.stringify(processedFormData));
    }
    
    // 비로그인 사용자의 경우 로그인 페이지로 이동
    if (!isAuthenticated) {
      // 로그인 페이지로 이동 (로그인 후 /saju/teaser로 자동 이동됨)
      router.push('/auth/login');
      return;
    }

    // 쿼리 파라미터 생성
    const birth = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
    const time = formData.birthHour !== 'unknown' ? formData.birthHour : '';
    const gender = formData.gender === 'male' ? 'male' : 'female';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Seoul';
    
    const queryParams = new URLSearchParams({
      birth,
      gender,
      name: formData.name,
      tz,
    });
    
    if (time) {
      queryParams.set('time', time);
    }

    // 로그인한 사용자는 티저 페이지로 이동 (쿼리 파라미터 포함)
    router.push(`/saju/teaser?${queryParams.toString()}`);
  };

  // 초기화 중일 때만 로딩 표시
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-purple-600 mb-2">
                사주 정보 입력
              </h1>
              <p className="text-gray-600">
                정확한 사주 해석을 위해 정보를 입력해주세요
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              {/* 로그인한 경우에만 로그아웃 버튼 표시 */}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  size="sm"
                  className="text-gray-500 hover:text-red-600 hover:border-red-600"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Button>
              )}
            </div>
          </div>
          
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              안녕하세요, {user.name}님! 👋
            </p>
          )}
          {needsAgreement && Object.values(needsAgreement).some(Boolean) && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                일부 정보가 자동으로 채워지지 않았습니다. 카카오에서 추가 동의가 필요한 정보를 수동으로 입력해주세요.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 카카오 자동입력 배너 */}
        <KakaoAutofillBanner />

        {/* 사주 입력 폼 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              기본 정보
            </CardTitle>
            <CardDescription>
              생년월일시와 개인정보를 정확히 입력해주세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  이름 *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력해주세요"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 성별 */}
              <div className="space-y-2">
                <Label>성별 *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="성별을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.gender}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 생년월일 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthYear">생년 *</Label>
                  <Input
                    id="birthYear"
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => handleInputChange('birthYear', e.target.value)}
                    placeholder="1990"
                    min="1900"
                    max="2024"
                    className={errors.birthYear ? 'border-red-500' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthMonth">월 *</Label>
                  <Select
                    value={formData.birthMonth}
                    onValueChange={(value) => handleInputChange('birthMonth', value)}
                  >
                    <SelectTrigger className={errors.birthYear ? 'border-red-500' : ''}>
                      <SelectValue placeholder="월" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDay">일 *</Label>
                  <Input
                    id="birthDay"
                    type="number"
                    value={formData.birthDay}
                    onChange={(e) => handleInputChange('birthDay', e.target.value)}
                    placeholder="15"
                    min="1"
                    max="31"
                    className={errors.birthYear ? 'border-red-500' : ''}
                  />
                </div>
              </div>
              {errors.birthYear && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.birthYear}</AlertDescription>
                </Alert>
              )}

              {/* 출생시간 */}
              <div className="space-y-2">
                <Label>출생시간 *</Label>
                <div className="space-y-3">
                  <Select
                    value={formData.birthHour}
                    onValueChange={(value) => handleInputChange('birthHour', value)}
                    disabled={formData.birthHourUnknown}
                  >
                    <SelectTrigger className={errors.birthHour ? 'border-red-500' : ''}>
                      <SelectValue placeholder="출생시간을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={hour}>
                            {hour}시
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="birthHourUnknown"
                      checked={formData.birthHourUnknown}
                      onCheckedChange={handleBirthHourUnknownChange}
                    />
                    <Label 
                      htmlFor="birthHourUnknown" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      출생시간을 모릅니다
                    </Label>
                  </div>
                </div>
                {errors.birthHour && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.birthHour}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  전화번호 *
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="01012345678 (숫자만 입력)"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.phoneNumber}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* 궁금한 점 */}
              <div className="space-y-2">
                <Label htmlFor="question" className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  궁금한 점 (선택사항)
                </Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="사주 해석에서 궁금한 점이 있다면 입력해주세요"
                  rows={3}
                />
              </div>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                size="lg"
              >
                사주 해석 받기 (29,800원)
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
