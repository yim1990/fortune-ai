# 여우도령 정통사주 Information Architecture (IA)

## 1. Site Map (사이트맵)

```
여우도령 정통사주 (/)
├── 홈 (/)
├── 서비스 소개 (/about)
├── 가격 안내 (/pricing)
├── FAQ (/faq)
├── 인증 (/auth)
│   ├── 로그인 (/auth/login)
│   ├── 회원가입 (/auth/signup)
│   └── 비밀번호 찾기 (/auth/reset-password)
├── 사주 보기 서비스 (/saju)
│   ├── 정보 입력 (/saju/input)
│   ├── 결제 (/saju/payment)
│   ├── 결과 생성 대기 (/saju/processing)
│   └── 결과 확인 (/saju/result/:id)
├── 마이페이지 (/my) [인증 필요]
│   ├── 내 정보 (/my/profile)
│   ├── 내 결과 목록 (/my/results)
│   ├── 결제 내역 (/my/payments)
│   └── 설정 (/my/settings)
├── 공유 페이지 (/share/:id)
├── 이용약관 (/terms)
├── 개인정보처리방침 (/privacy)
└── 고객센터 (/support)
```

## 2. User Flow (사용자 흐름)

### 주요 작업: 사주 보기 (신규 사용자)
1. 홈페이지 접속 → '사주 바로 보기' CTA 클릭
2. 정보 입력 페이지 → 생년월일시, 성별, 이름, 전화번호, 궁금한 점 입력
3. 입력 정보 확인 → '결제하기' 버튼 클릭
4. 결제 페이지 → 카드/간편결제 선택 및 결제 진행
5. 결제 완료 → 결과 생성 대기 화면 (로딩 애니메이션)
6. 결과 페이지 → 웹툰 형식 사주 결과 확인
7. 결과 공유 → SNS 공유 버튼 클릭 또는 링크 복사

### 주요 작업: 과거 결과 재확인 (기존 사용자)
1. 홈페이지 접속 → '로그인' 클릭
2. 로그인 페이지 → 이메일/비밀번호 입력 또는 소셜 로그인
3. 마이페이지 → '내 결과 목록' 메뉴 클릭
4. 결과 목록 → 원하는 결과 카드 클릭
5. 결과 상세 페이지 → 과거 사주 결과 재확인
6. 필요 시 공유 또는 PDF 다운로드

### 주요 작업: 회원가입 및 계정 연동
1. 결과 확인 후 → '내 결과 보관하기' 버튼 클릭
2. 회원가입 페이지 → 이메일 입력 또는 소셜 로그인 선택
3. 계정 생성 완료 → 현재 결과 자동 저장
4. 마이페이지로 자동 이동 → 저장된 결과 확인

## 3. Navigation Structure (네비게이션 구조)

### Global Navigation Bar (GNB)
**위치**: 상단 고정
**구성 요소**:
- 좌측: 여우도령 로고 (홈으로 이동)
- 우측: 
  - 비로그인 시: '로그인' 버튼
  - 로그인 시: 프로필 아이콘 (드롭다운 메뉴)
    - 내 정보
    - 내 결과
    - 설정
    - 로그아웃

### Footer Navigation
**구성 요소**:
- 회사 정보 (여우도령, 사업자등록번호)
- 법적 링크 (이용약관, 개인정보처리방침)
- 고객센터 링크
- SNS 링크 (인스타그램, 카카오톡)

### Mobile Bottom Navigation (모바일 전용)
**구성 요소**:
- 홈 (집 아이콘)
- 내 결과 (별 아이콘) [로그인 필요]
- 사주보기 (중앙 원형 CTA)
- FAQ (물음표 아이콘)
- 마이페이지 (사용자 아이콘) [로그인 필요]

## 4. Page Hierarchy (페이지 계층 구조)

```
/ (Depth 1)
├── /about (Depth 2)
├── /pricing (Depth 2)
├── /faq (Depth 2)
├── /auth (Depth 2)
│   ├── /auth/login (Depth 3)
│   ├── /auth/signup (Depth 3)
│   └── /auth/reset-password (Depth 3)
├── /saju (Depth 2)
│   ├── /saju/input (Depth 3)
│   ├── /saju/payment (Depth 3)
│   ├── /saju/processing (Depth 3)
│   └── /saju/result/:id (Depth 3)
├── /my (Depth 2) [인증 필요]
│   ├── /my/profile (Depth 3)
│   ├── /my/results (Depth 3)
│   ├── /my/payments (Depth 3)
│   └── /my/settings (Depth 3)
├── /share/:id (Depth 2)
├── /terms (Depth 2)
├── /privacy (Depth 2)
└── /support (Depth 2)
```

## 5. Content Organization (콘텐츠 구성)

| 페이지 | 주요 콘텐츠 요소 |
|---|---|
| 홈 (/) | Hero 섹션, 서비스 소개, 여우 캐릭터 일러스트, '사주 바로 보기' CTA, 후기 섹션, 가격 정보 |
| 정보 입력 (/saju/input) | 프로그레스 바, 입력 폼 (생년월일시, 성별, 이름, 전화번호, 궁금한 점), 유효성 검사 메시지, 여우 캐릭터 가이드 |
| 결제 (/saju/payment) | 입력 정보 요약, 가격 정보 (29,800원), 결제 수단 선택, 결제 버튼, 보안 안내 |
| 결과 대기 (/saju/processing) | 여우 캐릭터 로딩 애니메이션, 진행 상황 텍스트, 예상 소요 시간 (15초) |
| 결과 확인 (/saju/result/:id) | 웹툰 패널 이미지, AI 해석 텍스트, 공유 버튼, PDF 다운로드, '내 결과 보관' CTA |
| 내 결과 목록 (/my/results) | 결과 카드 리스트, 날짜별 정렬, 검색 필터, 페이지네이션 |
| 마이페이지 (/my/profile) | 사용자 정보, 프로필 편집 폼, 계정 연동 상태, 알림 설정 |

## 6. Interaction Patterns (인터랙션 패턴)

### 모달 사용 패턴
- **로그인 모달**: 홈에서 '로그인' 클릭 시 오버레이 모달
- **공유 모달**: 결과 페이지에서 '공유하기' 클릭 시 SNS 옵션 표시
- **확인 모달**: 결제 전 최종 확인, 계정 삭제 등 중요 액션

### 툴팁 및 도움말
- **입력 필드 도움말**: 생년월일시 입력 시 양력/음력 안내
- **가이드 툴팁**: 여우 캐릭터 말풍선으로 단계별 안내
- **오류 메시지**: 실시간 유효성 검사 결과 표시

### 무한 스크롤 및 페이지네이션
- **결과 페이지**: 웹툰 패널의 세로 무한 스크롤
- **내 결과 목록**: 카드 기반 페이지네이션 (10개씩)
- **FAQ 페이지**: 아코디언 방식 확장/축소

### 로딩 상태 관리
- **페이지 로딩**: 여우 꼬리 흔들기 애니메이션
- **결제 처리**: 프로그레스 바와 단계별 안내
- **이미지 로딩**: 스켈레톤 UI로 레이아웃 유지

## 7. URL Structure (URL 구조)

### URL 명명 규칙
- **일반 페이지**: `/resource-name` (소문자, 하이픈 사용)
- **상세 페이지**: `/resource-name/:id` (동적 파라미터)
- **중첩 리소스**: `/parent/child` (최대 3단계 깊이)
- **인증 페이지**: `/auth/action` (auth 네임스페이스)

### SEO 친화적 URL 예시
```
/ (홈페이지)
/about (서비스 소개)
/pricing (가격 안내)
/faq (자주 묻는 질문)
/auth/login (로그인)
/auth/signup (회원가입)
/saju/input (정보 입력)
/saju/payment (결제)
/saju/result/abc123 (결과 확인)
/my/results (내 결과 목록)
/share/abc123 (공유 페이지)
/terms (이용약관)
/privacy (개인정보처리방침)
```

### 동적 라우팅
- `/saju/result/:resultId` - 개별 사주 결과
- `/share/:resultId` - 공유용 결과 페이지
- `/my/results/:resultId` - 내 결과 상세 보기

## 8. Component Hierarchy (컴포넌트 계층 구조)

### Global Components (전역 컴포넌트)
- **Header**: 로고, 네비게이션 메뉴, 로그인 상태
- **Footer**: 회사 정보, 법적 링크, SNS 링크
- **MobileBottomNav**: 모바일 하단 탭 네비게이션
- **LoadingSpinner**: 여우 캐릭터 로딩 애니메이션
- **Toast**: 성공/오류 알림 메시지

### Layout Components (레이아웃 컴포넌트)
- **PageLayout**: 기본 페이지 구조 (Header + Main + Footer)
- **AuthLayout**: 인증 페이지 전용 레이아웃
- **SajuFlowLayout**: 사주 보기 플로우 전용 레이아웃 (프로그레스 바 포함)
- **MyPageLayout**: 마이페이지 사이드바 포함 레이아웃

### Form Components (폼 컴포넌트)
- **DateTimePicker**: 생년월일시 입력 (달력 + 시간 선택)
- **GenderSelector**: 성별 선택 라디오 버튼
- **PhoneInput**: 전화번호 입력 (자동 하이픈 추가)
- **TextArea**: 궁금한 점 입력 (글자 수 제한 표시)
- **ValidationMessage**: 실시간 유효성 검사 메시지

### Card Components (카드 컴포넌트)
- **ServiceIntroCard**: 홈페이지 서비스 소개 카드
- **PricingCard**: 가격 정보 카드
- **ResultCard**: 내 결과 목록의 개별 결과 카드
- **PaymentSummaryCard**: 결제 페이지 주문 요약 카드
- **TestimonialCard**: 후기 카드

### Interactive Components (인터랙티브 컴포넌트)
- **ProgressBar**: 단계별 진행 상황 표시
- **ShareModal**: SNS 공유 모달
- **LoginModal**: 로그인 오버레이 모달
- **ConfirmDialog**: 확인/취소 다이얼로그
- **ImageViewer**: 웹툰 패널 이미지 뷰어 (확대/축소)

### Character Components (캐릭터 컴포넌트)
- **FoxCharacter**: 여우 캐릭터 (3가지 상태: 인사, 설명, 축하)
- **SpeechBubble**: 캐릭터 대화 말풍선
- **FoxLoadingAnimation**: 여우 꼬리 흔들기 로딩 애니메이션

### Payment Components (결제 컴포넌트)
- **PaymentMethodSelector**: 결제 수단 선택 (카드/간편결제)
- **PaymentForm**: 결제 정보 입력 폼
- **PaymentResult**: 결제 완료/실패 결과 표시
- **PGIntegration**: PG사 연동 컴포넌트

### Result Components (결과 컴포넌트)
- **WebtoonPanel**: 개별 웹툰 패널 표시
- **WebtoonViewer**: 전체 웹툰 결과 뷰어 (스크롤 최적화)
- **SajuSummary**: 사주 요약 정보
- **ShareButtons**: 공유 버튼 그룹 (인스타그램, 카카오톡, 링크 복사)
- **PDFDownloadButton**: PDF 다운로드 버튼