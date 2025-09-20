# 연화당 정통사주 Design Guide

## 1. Overall Mood (전체적인 무드)

**Fun & Trendy Korean Traditional**

연화당 정통사주는 전통 사주를 현대적이고 재미있게 재해석한 서비스로, 20-30대 여성 사용자가 친근하고 즐겁게 접근할 수 있는 디자인 무드를 추구합니다. 전통적인 한국의 아름다움을 현대적 감각으로 표현하되, 무겁거나 딱딱하지 않은 밝고 경쾌한 분위기를 조성합니다.

핵심 키워드:
- **친근함**: 잘생긴 여우 캐릭터를 통한 친밀한 소통
- **현대성**: 웹툰 형식의 시각적 결과물과 트렌디한 컬러
- **신뢰성**: 정통 만세력 기반의 전문성을 시각적으로 표현
- **공유성**: SNS 친화적인 비주얼과 인터랙션

## 2. Reference Service (참조 서비스)

- **Name**: Kakao Friends Store
- **Description**: 카카오프렌즈 캐릭터 상품을 판매하는 온라인 스토어
- **Design Mood**: 밝고 귀여운 캐릭터 중심의 친근한 디자인, 파스텔 계열의 고채도 컬러 사용
- **Primary Color**: #FFE15D (카카오 옐로우)
- **Secondary Color**: #FF6B6B (포인트 핑크)

카카오프렌즈 스토어의 캐릭터 중심 레이아웃과 밝은 컬러 팔레트, 친근한 UI 요소들을 참고하여 연화당만의 독특한 여우 캐릭터와 한국 전통 요소를 결합한 디자인을 구현합니다.

## 3. Color & Gradient (색상 & 그라데이션)

### 주요 컬러 팔레트
- **Primary Color**: #FF6C8B (Main Blossom Pink)
- **Secondary Color**: #38D0A6 (Accent Mint)
- **Accent Color**: #FFD966 (Sunshine Yellow)
- **Background Color**: #FFF9F9 (Neutral Off-White)
- **Text Color**: #333333 (Dark Text)

### 보조 컬러
- **Success**: #38D0A6 (Accent Mint와 동일)
- **Warning**: #FFD966 (Sunshine Yellow와 동일)
- **Error**: #FF4757
- **Info**: #5352ED

### 그레이스케일
- **Gray 50**: #F8F9FA
- **Gray 100**: #F1F3F4
- **Gray 300**: #DEE2E6
- **Gray 500**: #868E96
- **Gray 700**: #495057
- **Gray 900**: #212529

**Mood**: Warm / High Saturation
**Color Usage**: 
1. Primary Color (Blossom Pink) - CTA 버튼, 중요 텍스트, 활성 상태
2. Secondary Color (Accent Mint) - 링크, 보조 액션, 성공 상태
3. Accent Color (Sunshine Yellow) - 배경 강조, 팁 박스, 알림
4. 중요도가 낮은 UI 요소일수록 그레이스케일 활용

## 4. Typography & Font (타이포그래피 & 폰트)

### 폰트 패밀리
- **Primary**: Pretendard (한글), Inter (영문)
- **Character Speech**: Gmarket Sans Medium (캐릭터 대화)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### 타이포그래피 스케일
- **Heading 1**: Pretendard Bold, 32px, Line-height 1.2, Letter-spacing -0.02em
- **Heading 2**: Pretendard Bold, 28px, Line-height 1.25, Letter-spacing -0.01em
- **Heading 3**: Pretendard SemiBold, 24px, Line-height 1.3
- **Heading 4**: Pretendard SemiBold, 20px, Line-height 1.35
- **Body Large**: Pretendard Regular, 18px, Line-height 1.6
- **Body**: Pretendard Regular, 16px, Line-height 1.6
- **Body Small**: Pretendard Regular, 14px, Line-height 1.5
- **Caption**: Pretendard Medium, 12px, Line-height 1.4

### 특수 용도
- **Character Speech**: Gmarket Sans Medium, 18px, Line-height 1.4
- **Logo Text**: Pretendard ExtraBold, 24px

## 5. Layout & Structure (레이아웃 & 구조)

### 그리드 시스템
- **데스크톱**: 12 컬럼 그리드, 최대 너비 1200px
- **태블릿**: 8 컬럼 그리드, 최대 너비 768px
- **모바일**: 4 컬럼 그리드, 최소 너비 320px

### 여백 시스템
- **기본 단위**: 4px
- **컴포넌트 간격**: 16px, 24px, 32px, 48px
- **섹션 간격**: 64px, 80px, 96px
- **페이지 패딩**: 16px (모바일), 24px (태블릿), 32px (데스크톱)

### 레이아웃 원칙
1. **모바일 퍼스트**: 320px부터 시작하는 반응형 디자인
2. **컨텐츠 중심**: 사용자 입력과 결과 표시에 최적화
3. **스크롤 친화적**: 세로 스크롤을 활용한 자연스러운 정보 흐름
4. **터치 최적화**: 최소 44px 터치 영역 확보

## 6. Visual Style (비주얼 스타일)

### 아이콘 스타일
- **아이콘 세트**: Lucide React
- **스트로크**: 1.5px
- **크기**: 16px, 20px, 24px, 32px
- **스타일**: 미니멀한 라인 아이콘, 둥근 모서리

### 일러스트레이션
- **캐릭터**: 잘생긴 여우 캐릭터 (3가지 포즈: 인사, 설명, 축하)
- **웹툰 패널**: 1080×1920px, 4-6컷 세로 스크롤 형태
- **스타일**: 부드러운 라인, 따뜻한 컬러, 친근한 표정

### 이미지 정책
- **AI 생성 이미지**: 2048px 이상, WebP 형식, CDN 캐시
- **웹툰 패널**: JPG 80% 품질, Lazy Loading 적용
- **아이콘**: SVG 형식 우선, PNG 백업

### 그림자 및 효과
- **카드 그림자**: 0 2px 8px rgba(0, 0, 0, 0.1)
- **버튼 그림자**: 0 2px 4px rgba(255, 108, 139, 0.2)
- **모서리**: 8px, 12px, 16px 라운드 처리

## 7. UX Guide (UX 가이드)

### 타겟 사용자: 초보자 중심 (20-30대 여성)

### 핵심 UX 원칙
1. **직관적 흐름**: 입력 → 결제 → 결과 확인까지 최소 클릭
2. **즉시 피드백**: 모든 액션에 대한 즉각적인 시각적 피드백
3. **친근한 가이드**: 여우 캐릭터를 통한 단계별 안내
4. **오류 방지**: 실시간 유효성 검사와 명확한 오류 메시지

### 인터랙션 패턴
- **프로그레스 바**: 단계별 진행 상황 표시
- **로딩 애니메이션**: 여우 꼬리 흔들기 애니메이션 (3초 루프)
- **버튼 호버**: Scale 1.02, Transition 0.15s
- **페이지 전환**: 부드러운 슬라이드 애니메이션

### 접근성 고려사항
- **컬러 대비**: WCAG AA 기준 충족 (4.5:1 이상)
- **최소 폰트 크기**: 14px 이상
- **터치 영역**: 최소 44px × 44px
- **키보드 네비게이션**: Tab 순서와 Focus 표시

## 8. UI Component Guide (UI 컴포넌트 가이드)

### 버튼
**Primary Button**
- 배경: #FF6C8B (Blossom Pink)
- 텍스트: #FFFFFF, Pretendard SemiBold 16px
- 패딩: 12px 24px
- 라운드: 12px
- 호버: Scale 1.02, 배경 #FF5A7A

**Secondary Button**
- 배경: transparent
- 테두리: 2px solid #FF6C8B
- 텍스트: #FF6C8B, Pretendard SemiBold 16px
- 패딩: 10px 22px
- 라운드: 12px

### 입력 필드
**Text Input**
- 배경: #FFF9F9 (Off-White)
- 테두리: 1px solid #DEE2E6
- 텍스트: #333333, Pretendard Regular 16px
- 플레이스홀더: #868E96 (70% opacity)
- 패딩: 12px 16px
- 라운드: 8px
- Focus: 테두리 #FF6C8B, 그림자 0 0 0 3px rgba(255, 108, 139, 0.1)

### 카드
**Content Card**
- 배경: #FFFFFF
- 그림자: 0 2px 8px rgba(0, 0, 0, 0.1)
- 라운드: 16px
- 패딩: 24px
- 테두리: none

**Result Card**
- 배경: linear-gradient(135deg, #FFF9F9 0%, #FFE15D 100%)
- 그림자: 0 4px 12px rgba(255, 108, 139, 0.15)
- 라운드: 20px
- 패딩: 32px 24px

### 내비게이션
**Top Navigation**
- 높이: 64px
- 배경: #FFFFFF
- 그림자: 0 2px 4px rgba(0, 0, 0, 0.05)
- 로고: 좌측 정렬, Pretendard ExtraBold 24px
- 메뉴: 우측 정렬, Pretendard Medium 16px

### 알림 및 팁
**Tip Box**
- 배경: #FFD966 (Sunshine Yellow)
- 텍스트: #333333, Pretendard Regular 14px
- 패딩: 12px 16px
- 라운드: 8px
- 아이콘: 전구 아이콘 20px

**Success Message**
- 배경: #38D0A6
- 텍스트: #FFFFFF
- 아이콘: 체크 아이콘

**Error Message**
- 배경: #FF4757
- 텍스트: #FFFFFF
- 아이콘: 경고 아이콘

### 로딩 상태
**Loading Spinner**
- 여우 꼬리 흔들기 Lottie 애니메이션
- 크기: 80px × 80px
- 배경: 반투명 오버레이 rgba(0, 0, 0, 0.3)
- 텍스트: "잠시만 기다려주세요..." Pretendard Regular 16px

### 웹툰 패널
**Panel Container**
- 최대 너비: 400px (모바일 최적화)
- 배경: #FFFFFF
- 그림자: 0 4px 16px rgba(0, 0, 0, 0.1)
- 라운드: 16px
- 여백: 각 패널 간 16px

**Speech Bubble**
- 배경: #FFF9F9
- 테두리: 2px solid #FF6C8B
- 텍스트: Gmarket Sans Medium 18px
- 말꼬리: CSS pseudo-element로 구현