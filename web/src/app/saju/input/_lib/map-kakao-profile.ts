/**
 * 카카오 프로필을 사주 입력 폼 데이터로 매핑하는 유틸리티
 */

import { SajuFormData } from '@/contexts/PaymentInputContext';

/**
 * 카카오 프로필 데이터 구조
 */
export interface KakaoProfileData {
  name: string | null;
  phone: string | null;
  gender: 'M' | 'F' | null;
  birthdate: string | null;
  needs_agreement?: {
    name?: boolean;
    phone?: boolean;
    gender?: boolean;
    birthdate?: boolean;
  };
}

/**
 * 카카오 성별을 사주 폼 성별로 매핑
 * M -> male, F -> female, null -> ''
 */
function mapGender(gender: 'M' | 'F' | null): 'male' | 'female' | '' {
  switch (gender) {
    case 'M':
      return 'male';
    case 'F':
      return 'female';
    default:
      return '';
  }
}

/**
 * 생년월일 문자열을 년/월/일로 분리
 * YYYY-MM-DD 형식의 문자열을 { birthYear, birthMonth, birthDay }로 변환
 */
function parseBirthdate(birthdate: string | null): {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
} {
  if (!birthdate) {
    return {
      birthYear: '',
      birthMonth: '',
      birthDay: '',
    };
  }

  const [year, month, day] = birthdate.split('-');
  return {
    birthYear: year || '',
    birthMonth: month || '',
    birthDay: day || '',
  };
}

/**
 * 카카오 프로필을 사주 입력 폼 데이터로 매핑
 */
export function mapKakaoProfileToForm(profile: KakaoProfileData, existingFormData?: Partial<SajuFormData>): Partial<SajuFormData> {
  const mappedData: Partial<SajuFormData> = {
    name: profile.name || existingFormData?.name || '',
    gender: mapGender(profile.gender),
    phoneNumber: profile.phone || existingFormData?.phoneNumber || '',
  };

  // 생년월일 파싱
  if (profile.birthdate) {
    const { birthYear, birthMonth, birthDay } = parseBirthdate(profile.birthdate);
    mappedData.birthYear = birthYear || existingFormData?.birthYear || '';
    mappedData.birthMonth = birthMonth || existingFormData?.birthMonth || '';
    mappedData.birthDay = birthDay || existingFormData?.birthDay || '';
  }

  return mappedData;
}

