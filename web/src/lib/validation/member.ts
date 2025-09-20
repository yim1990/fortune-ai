import { MemberUpsertData, MemberValidation } from '@/types/member';

/**
 * 전화번호 유효성 검증
 * 010-xxxx-xxxx 형식 검증
 */
export function validatePhone(phone: string | null | undefined): boolean {
  if (!phone) return true; // null/undefined는 허용 (선택사항)
  
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
}

/**
 * 생년월일 유효성 검증
 * YYYY-MM-DD 형식 및 실제 날짜 검증
 */
export function validateBirthdate(birthdate: string | null | undefined): boolean {
  if (!birthdate) return true; // null/undefined는 허용 (선택사항)
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birthdate)) return false;
  
  const date = new Date(birthdate);
  const now = new Date();
  
  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) return false;
  
  // 미래 날짜는 불가능
  if (date > now) return false;
  
  // 1900년 이전은 불가능 (현실적 범위)
  if (date.getFullYear() < 1900) return false;
  
  return true;
}

/**
 * 성별 유효성 검증
 */
export function validateGender(gender: string | null | undefined): boolean {
  if (!gender) return true; // null/undefined는 허용 (선택사항)
  return gender === 'M' || gender === 'F';
}

/**
 * 이름 유효성 검증
 * 2-20자, 한글/영문만 허용
 */
export function validateName(name: string | null | undefined): boolean {
  if (!name) return true; // null/undefined는 허용 (선택사항)
  
  const nameRegex = /^[가-힣a-zA-Z\s]{2,20}$/;
  return nameRegex.test(name.trim());
}

/**
 * 카카오 ID 유효성 검증
 * 필수 필드, 숫자만 허용
 */
export function validateKakaoId(kakaoId: string): boolean {
  if (!kakaoId) return false;
  
  const kakaoIdRegex = /^\d+$/;
  return kakaoIdRegex.test(kakaoId);
}

/**
 * 회원 정보 전체 유효성 검증
 */
export function validateMemberData(data: MemberUpsertData): MemberValidation {
  const errors: Record<string, string> = {};

  // 필수 필드 검증
  if (!validateKakaoId(data.kakao_id)) {
    errors.kakao_id = '유효한 카카오 ID가 필요합니다.';
  }

  // 선택 필드 검증
  if (data.name && !validateName(data.name)) {
    errors.name = '이름은 2-20자의 한글 또는 영문만 입력 가능합니다.';
  }

  if (data.birthdate && !validateBirthdate(data.birthdate)) {
    errors.birthdate = '올바른 생년월일 형식(YYYY-MM-DD)을 입력해주세요.';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = '올바른 전화번호 형식(010-xxxx-xxxx)을 입력해주세요.';
  }

  if (data.gender && !validateGender(data.gender)) {
    errors.gender = '성별은 M(남성) 또는 F(여성)만 입력 가능합니다.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 전화번호 마스킹 처리
 * 개인정보 보호를 위한 전화번호 마스킹
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // 010-1234-5678 -> 010-****-5678
  return phone.replace(/(\d{3}-\d{4})-\d{4}/, '$1-****');
}

/**
 * 생년월일에서 나이 계산
 */
export function calculateAge(birthdate: string | null | undefined): number | null {
  if (!birthdate) return null;
  
  const birth = new Date(birthdate);
  const now = new Date();
  
  if (isNaN(birth.getTime())) return null;
  
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
