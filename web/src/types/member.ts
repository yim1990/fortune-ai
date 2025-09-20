/**
 * 회원 정보 타입 정의
 */

/**
 * 동의 필요 항목 타입
 */
export interface NeedsAgreement {
  name?: boolean;
  birthdate?: boolean;
  phone?: boolean;
  gender?: boolean;
  email?: boolean;
}

/**
 * 데이터베이스의 members 테이블 구조
 */
export interface Member {
  id: string;
  kakao_id: string;
  name: string | null;
  birthdate: string | null; // YYYY-MM-DD 형식
  phone: string | null;
  gender: 'M' | 'F' | null;
  email: string | null;
  needs_agreement: NeedsAgreement | null;
  consent_personal_info: boolean;
  last_login_at: string | null; // ISO 8601 형식
  created_at: string; // ISO 8601 형식
  updated_at: string; // ISO 8601 형식
}

/**
 * 회원 정보 생성/업데이트용 타입
 */
export interface MemberUpsertData {
  kakao_id: string;
  name?: string | null;
  birthdate?: string | null; // YYYY-MM-DD 형식
  phone?: string | null;
  gender?: 'M' | 'F' | null;
  email?: string | null;
  needs_agreement?: NeedsAgreement | null;
  consent_personal_info?: boolean;
}

/**
 * 회원 정보 응답 타입
 */
export interface MemberResponse {
  success: boolean;
  member?: Member;
  error?: string;
}

/**
 * 회원 정보 검증 타입
 */
export interface MemberValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
