-- members 테이블에 needs_agreement 컬럼 추가
-- 카카오 OAuth에서 동의가 필요한 항목들을 저장하기 위한 JSONB 컬럼

-- needs_agreement 컬럼 추가 (JSONB 타입)
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS needs_agreement JSONB;

-- needs_agreement 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN public.members.needs_agreement IS '카카오 OAuth 동의 필요 항목들 (JSON 형태)';

-- needs_agreement 컬럼에 대한 인덱스 생성 (GIN 인덱스 - JSONB 검색용)
CREATE INDEX IF NOT EXISTS idx_members_needs_agreement ON public.members USING GIN (needs_agreement) WHERE needs_agreement IS NOT NULL;
