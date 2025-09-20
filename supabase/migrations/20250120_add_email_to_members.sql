-- members 테이블에 email 컬럼 추가
-- 카카오 OAuth에서 받은 이메일 정보를 저장하기 위한 컬럼

-- email 컬럼 추가
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS email TEXT;

-- email 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN public.members.email IS '이메일 주소 (카카오 OAuth에서 수집)';

-- email 컬럼에 대한 인덱스 생성 (선택사항 - 이메일로 검색할 경우)
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email) WHERE email IS NOT NULL;
