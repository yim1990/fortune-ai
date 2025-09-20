import jwt from 'jsonwebtoken';

/**
 * 세션 데이터 타입 정의
 */
export interface SessionData {
  accessToken: string;
  kakaoId?: string;
  name?: string;        // 실명
  email?: string;
  gender?: 'male' | 'female';
  birthday?: string;
  birthyear?: string;
  phoneNumber?: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT 세션 토큰 생성
 * 사용자 인증 정보를 암호화하여 쿠키에 저장
 */
export function createSessionToken(data: Partial<SessionData>): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  const payload: SessionData = {
    accessToken: data.accessToken || '',
    kakaoId: data.kakaoId,
    name: data.name,
    email: data.email,
    gender: data.gender,
    birthday: data.birthday,
    birthyear: data.birthyear,
    phoneNumber: data.phoneNumber,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24시간
  };

  return jwt.sign(payload, secret);
}

/**
 * JWT 세션 토큰 검증 및 디코딩
 * 쿠키에서 세션 정보를 안전하게 추출
 */
export function verifySessionToken(token: string): SessionData | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }

  try {
    const decoded = jwt.verify(token, secret) as SessionData;
    return decoded;
  } catch (error) {
    console.error('Session token verification failed:', error);
    return null;
  }
}
