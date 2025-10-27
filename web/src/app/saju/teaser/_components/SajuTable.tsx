'use client';

/**
 * 사주팔자 표 컴포넌트
 * 피그마 디자인을 정확하게 복제한 사주표
 */

/**
 * 사주 데이터 타입 (PHP API 응답)
 */
interface SajuData {
  lunar_date: string | null;
  saju: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  elements: {
    heavenly_stems: string[];
    earthly_branches: string[];
  };
  sipseong: string[]; // 천간의 십성 [년간, 월간, 일간, 시간] 순서
  sipseong_ji: string[]; // 지지의 십성 [년지, 월지, 일지, 시지] 순서
}

interface SajuTableProps {
  userName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthTime: string;
  sajuData: SajuData;
}

/**
 * 천간 매핑
 */
const CHEONGAN_MAP: { [key: string]: { hanja: string; element: string; color: string } } = {
  '갑': { hanja: '甲', element: '陽木', color: '#AFC78C' },
  '을': { hanja: '乙', element: '陰木', color: '#AFC78C' },
  '병': { hanja: '丙', element: '陽火', color: '#F58686' },
  '정': { hanja: '丁', element: '陰火', color: '#F58686' },
  '무': { hanja: '戊', element: '陽土', color: '#B79C89' },
  '기': { hanja: '己', element: '陰土', color: '#B79C89' },
  '경': { hanja: '庚', element: '陽金', color: '#F7EF95' },
  '신': { hanja: '辛', element: '陰金', color: '#F7EF95' },
  '임': { hanja: '壬', element: '陽水', color: '#9ECEE8' },
  '계': { hanja: '癸', element: '陰水', color: '#9ECEE8' },
};

/**
 * 지지 매핑
 */
const JIJI_MAP: { [key: string]: { hanja: string; element: string; color: string } } = {
  '자': { hanja: '子', element: '陽水', color: '#9ECEE8' },
  '축': { hanja: '丑', element: '陰土', color: '#B79C89' },
  '인': { hanja: '寅', element: '陽木', color: '#AFC78C' },
  '묘': { hanja: '卯', element: '陰木', color: '#AFC78C' },
  '진': { hanja: '辰', element: '陽土', color: '#B79C89' },
  '사': { hanja: '巳', element: '陰火', color: '#F58686' },
  '오': { hanja: '午', element: '陽火', color: '#F58686' },
  '미': { hanja: '未', element: '陰土', color: '#B79C89' },
  '신': { hanja: '申', element: '陽金', color: '#F7EF95' },
  '유': { hanja: '酉', element: '陰金', color: '#F7EF95' },
  '술': { hanja: '戌', element: '陽土', color: '#B79C89' },
  '해': { hanja: '亥', element: '陰水', color: '#9ECEE8' },
};

/**
 * 십성 매핑 (한글 → 한자)
 */
const SIPSEONG_MAP: { [key: string]: string } = {
  '비견': '比肩',
  '겁재': '劫財',
  '식신': '食神',
  '상관': '傷官',
  '편재': '偏財',
  '정재': '正財',
  '편관': '偏官',
  '정관': '正官',
  '편인': '偏印',
  '정인': '正印',
};

/**
 * 십성 셀 컴포넌트
 */
function SipseongCell({ koreanText }: { koreanText: string }) {
  const hanja = SIPSEONG_MAP[koreanText];
  
  if (!hanja) {
    return (
      <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
        <span className="text-black/40 text-sm">-</span>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-black text-base font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>
          {hanja}
        </span>
        <span className="text-black text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>
          {koreanText}
        </span>
      </div>
    </div>
  );
}

/**
 * 천간/지지 셀 컴포넌트
 */
function ElementCell({ 
  koreanText, 
  isHeavenlyStem 
}: { 
  koreanText: string; 
  isHeavenlyStem: boolean;
}) {
  // 천간인지 지지인지에 따라 적절한 맵 선택
  const map = isHeavenlyStem ? CHEONGAN_MAP : JIJI_MAP;
  const info = map[koreanText];
  
  if (!info) {
    return (
      <div className="flex-1 bg-[#FFFDF5] h-[100px] flex items-center justify-center">
        <span className="text-black text-sm">{koreanText}</span>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 h-[100px] flex items-center justify-center"
      style={{ backgroundColor: info.color }}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-black text-xs font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>
          {koreanText}
        </span>
        <span className="text-black text-3xl font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>
          {info.hanja}
        </span>
        <span className="text-black text-xs font-semibold" style={{ fontFamily: "'Noto Serif HK', serif" }}>
          {info.element}
        </span>
      </div>
    </div>
  );
}

/**
 * 사주팔자 표 - 피그마 디자인 복제
 */
export function SajuTable({ 
  userName, 
  birthYear, 
  birthMonth, 
  birthDay, 
  birthTime,
  sajuData 
}: SajuTableProps) {
  // PHP API에서 받은 데이터를 파싱
  // sajuData.saju는 "갑자" 형식 (천간+지지)
  const parseGanJi = (ganJi: string): { gan: string; ji: string } => {
    if (ganJi.length === 2) {
      return { gan: ganJi[0], ji: ganJi[1] };
    }
    return { gan: '', ji: '' };
  };

  const year = parseGanJi(sajuData.saju.year);
  const month = parseGanJi(sajuData.saju.month);
  const day = parseGanJi(sajuData.saju.day);
  const hour = parseGanJi(sajuData.saju.hour);

  // 천간 십성 데이터 파싱 (API: [년간, 월간, 일간, 시간] → 화면: 時日月年 순서)
  const sipseongData = sajuData.sipseong || [];
  const sipseong = {
    hour: sipseongData[3] || '', // 시간
    day: sipseongData[2] || '',   // 일간
    month: sipseongData[1] || '', // 월간
    year: sipseongData[0] || ''   // 년간
  };

  // 지지 십성 데이터 파싱 (API: [년지, 월지, 일지, 시지] → 화면: 時日月年 순서)
  const sipseongJiData = sajuData.sipseong_ji || [];
  const sipseongJi = {
    hour: sipseongJiData[3] || '', // 시지
    day: sipseongJiData[2] || '',   // 일지
    month: sipseongJiData[1] || '', // 월지
    year: sipseongJiData[0] || ''   // 년지
  };

  return (
    <div className="border border-[#E2DCC4] rounded-lg p-1 bg-white">
      <div className="border border-[#9D9A87] rounded-lg overflow-hidden">
        {/* 헤더 영역 */}
        <div className="p-8 pb-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-4xl leading-tight">
              <span className="text-[#858373] font-bold" style={{ fontFamily: "'Yydimibang OTF', serif" }}>
                {userName}
              </span>
              <span className="text-black font-bold" style={{ fontFamily: "'Yydimibang OTF', serif" }}>
                님의 사주
              </span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="text-[#858373] font-bold">{birthYear}</span>
              <span className="text-black font-bold">년</span>
              <span className="text-[#858373] font-bold">{birthMonth}</span>
              <span className="text-black font-bold">월</span>
              <span className="text-[#858373] font-bold">{birthDay}</span>
              <span className="text-black font-bold">일</span>
              <span className="text-[#858373] font-bold">{birthTime}</span>
            </div>
          </div>
        </div>

        {/* 사주표 본체 */}
        <div className="flex flex-col gap-0.5">
          {/* 헤더 행 (時日月年) */}
          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD]"></div>
            <div className="flex-1 bg-[#F1EDDD] h-16 flex items-center justify-center">
              <span className="text-black text-2xl font-bold" style={{ fontFamily: "'Noto Serif HK', serif" }}>時</span>
            </div>
            <div className="flex-1 bg-[#F1EDDD] h-16 flex items-center justify-center">
              <span className="text-black text-2xl font-bold" style={{ fontFamily: "'Noto Serif HK', serif" }}>日</span>
            </div>
            <div className="flex-1 bg-[#F1EDDD] h-16 flex items-center justify-center">
              <span className="text-black text-2xl font-bold" style={{ fontFamily: "'Noto Serif HK', serif" }}>月</span>
            </div>
            <div className="flex-1 bg-[#F1EDDD] h-16 flex items-center justify-center">
              <span className="text-black text-2xl font-bold" style={{ fontFamily: "'Noto Serif HK', serif" }}>年</span>
            </div>
          </div>

          {/* 십성 행 1 (천간 기준) */}
          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-base font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>十聖</span>
                <span className="text-black text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>십성</span>
              </div>
            </div>
            <SipseongCell koreanText={sipseong.hour} />
            <SipseongCell koreanText={sipseong.day} />
            <SipseongCell koreanText={sipseong.month} />
            <SipseongCell koreanText={sipseong.year} />
          </div>

          {/* 천간 행 (실제 데이터) */}
          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-[100px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-base font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>天干</span>
                <span className="text-black text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>천간</span>
              </div>
            </div>
            <ElementCell koreanText={hour.gan} isHeavenlyStem={true} />
            <ElementCell koreanText={day.gan} isHeavenlyStem={true} />
            <ElementCell koreanText={month.gan} isHeavenlyStem={true} />
            <ElementCell koreanText={year.gan} isHeavenlyStem={true} />
          </div>

          {/* 지지 행 (실제 데이터) */}
          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-[100px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-base font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>地支</span>
                <span className="text-black text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>지지</span>
              </div>
            </div>
            <ElementCell koreanText={hour.ji} isHeavenlyStem={false} />
            <ElementCell koreanText={day.ji} isHeavenlyStem={false} />
            <ElementCell koreanText={month.ji} isHeavenlyStem={false} />
            <ElementCell koreanText={year.ji} isHeavenlyStem={false} />
          </div>

          {/* 십성 행 2 (지지 기준) */}
          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-base font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>十聖</span>
                <span className="text-black text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>십성</span>
              </div>
            </div>
            <SipseongCell koreanText={sipseongJi.hour} />
            <SipseongCell koreanText={sipseongJi.day} />
            <SipseongCell koreanText={sipseongJi.month} />
            <SipseongCell koreanText={sipseongJi.year} />
          </div>

          {/* 십이운성, 십이신살, 귀인은 임시 데이터로 유지 (추후 PHP API에서 제공 시 업데이트) */}
          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-xs font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>十二運星</span>
                <span className="text-black text-xs font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>십이운성</span>
              </div>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
          </div>

          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-xs font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>十二神殺</span>
                <span className="text-black text-xs font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>십이신살</span>
              </div>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-20 flex items-center justify-center">
              <span className="text-black/40 text-sm">-</span>
            </div>
          </div>

          <div className="flex gap-0.5">
            <div className="w-[70px] bg-[#F1EDDD] h-[100px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-black text-base font-black" style={{ fontFamily: "'Noto Serif HK', serif" }}>貴人</span>
                <span className="text-black text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>귀인</span>
              </div>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-[100px] flex items-center justify-center">
              <span className="text-black/40 text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-[100px] flex items-center justify-center">
              <span className="text-black/40 text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-[100px] flex items-center justify-center">
              <span className="text-black/40 text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>-</span>
            </div>
            <div className="flex-1 bg-[#FFFDF5] h-[100px] flex items-center justify-center">
              <span className="text-black/40 text-sm font-semibold" style={{ fontFamily: "'Noto Serif KR', serif" }}>-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
