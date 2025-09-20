import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 서버 전용 관리자 클라이언트
 * SERVICE_ROLE 키를 사용하여 RLS를 우회하고 모든 작업을 수행할 수 있음
 */
export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 환경변수 존재 여부 확인
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  }

  // URL 형식 검증
  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(`NEXT_PUBLIC_SUPABASE_URL이 유효한 URL 형식이 아닙니다: ${supabaseUrl}`);
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 서버 인증 확인
 * API 라우트에서 서버 사이드에서만 실행되는지 확인
 */
export function assertServerAuth() {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버 사이드에서만 실행할 수 있습니다.');
  }
}
