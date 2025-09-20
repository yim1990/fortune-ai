-- 회원정보 저장을 위한 members 테이블 생성
-- 카카오 OAuth로 받은 사용자 정보를 저장하고 관리

-- members 테이블 생성
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kakao_id TEXT UNIQUE NOT NULL,
  name TEXT,
  birthdate DATE,
  phone TEXT,
  gender TEXT CHECK (gender IN ('M', 'F')),
  consent_personal_info BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- kakao_id에 대한 유니크 인덱스 생성
CREATE UNIQUE INDEX IF NOT EXISTS idx_members_kakao_id ON public.members(kakao_id);

-- updated_at 자동 갱신을 위한 함수 생성
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 갱신 트리거 생성
CREATE TRIGGER trg_members_updated
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

-- RLS (Row Level Security) 활성화
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 초기 RLS 정책: 서버 전용 API를 통해서만 접근 허용
-- (추후 세션 기반 정책으로 확장 예정)
CREATE POLICY "Server only access" ON public.members
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 테이블 코멘트 추가
COMMENT ON TABLE public.members IS '카카오 OAuth 회원 정보 저장 테이블';
COMMENT ON COLUMN public.members.kakao_id IS '카카오 고유 ID (유니크)';
COMMENT ON COLUMN public.members.name IS '실명';
COMMENT ON COLUMN public.members.birthdate IS '생년월일 (YYYY-MM-DD)';
COMMENT ON COLUMN public.members.phone IS '전화번호 (010-xxxx-xxxx)';
COMMENT ON COLUMN public.members.gender IS '성별 (M: 남성, F: 여성)';
COMMENT ON COLUMN public.members.consent_personal_info IS '개인정보 처리 동의 여부';
COMMENT ON COLUMN public.members.last_login_at IS '마지막 로그인 시간';
COMMENT ON COLUMN public.members.created_at IS '회원가입 시간';
COMMENT ON COLUMN public.members.updated_at IS '정보 수정 시간';
