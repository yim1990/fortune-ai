'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { SajuTable } from './SajuTable';

/**
 * 티저 데이터 타입
 */
interface TeaserData {
  energy: string;
  summary: string;
  foxLine: string;
  zodiacName: string;
  zodiacEmoji: string;
  elementName: string;
  elementKeyword: string;
}

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

/**
 * TeaserClient Props
 */
interface TeaserClientProps {
  teaserData: TeaserData;
  userName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthTime: string;
  sajuData: SajuData;
}

/**
 * 말풍선 컴포넌트 (피그마 스타일)
 */
function SpeechBubble({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative bg-white border-2 border-black rounded-lg p-6 ${className}`}>
      {children}
      {/* 말풍선 꼬리 */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-black rotate-45"></div>
    </div>
  );
}

/**
 * 여우 캐릭터 컴포넌트
 */
function FoxCharacter({ imageSrc, alt }: { imageSrc: string; alt: string }) {
  return (
    <div className="flex justify-center">
      <div className="relative w-48 h-48">
        <Image 
          src={imageSrc} 
          alt={alt} 
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

/**
 * 시간을 십이지지 형식으로 변환
 */
function getTimeDisplay(hour: string): string {
  if (hour === 'unknown') return '시각 미상';
  
  const hourNum = parseInt(hour);
  const timeMap: { [key: number]: string } = {
    23: '자(子)시', 0: '자(子)시',
    1: '축(丑)시', 2: '축(丑)시',
    3: '인(寅)시', 4: '인(寅)시',
    5: '묘(卯)시', 6: '묘(卯)시',
    7: '진(辰)시', 8: '진(辰)시',
    9: '사(巳)시', 10: '사(巳)시',
    11: '오(午)시', 12: '오(午)시',
    13: '미(未)시', 14: '미(未)시',
    15: '신(申)시', 16: '신(申)시',
    17: '유(酉)시', 18: '유(酉)시',
    19: '술(戌)시', 20: '술(戌)시',
    21: '해(亥)시', 22: '해(亥)시',
  };
  
  return timeMap[hourNum] || `${hour}시`;
}

/**
 * 티저 페이지 클라이언트 컴포넌트
 * 피그마 디자인을 정확하게 복제 + 모바일 너비 고정
 */
export function TeaserClient({ 
  teaserData, 
  userName, 
  birthYear, 
  birthMonth, 
  birthDay, 
  birthTime,
  sajuData 
}: TeaserClientProps) {
  const router = useRouter();

  /**
   * 결제 페이지로 이동
   */
  const handleContinue = () => {
    router.push('/saju/payment?source=teaser&price=29800');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center">
      {/* 모바일 너비 고정 컨테이너 (375px) */}
      <div className="w-full max-w-[375px] relative">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/teaser/background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 반투명 오버레이 */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* 콘텐츠 */}
        <div className="relative z-10 px-4 py-12 space-y-8">
          
          {/* 1. 여우 캐릭터 등장 */}
          <div className="space-y-6">
            <FoxCharacter imageSrc="/teaser/fox-character-1.png" alt="여우도령" />
            <SpeechBubble>
              <p className="text-center text-lg font-medium" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                {userName}님, 만나서 반갑습니다.
              </p>
            </SpeechBubble>
          </div>

          {/* 2. 소개 */}
          <div className="space-y-6">
            <SpeechBubble>
              <p className="text-center text-lg leading-relaxed font-medium" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                지금부터 {userName}님의 사주를<br />
                알려드릴 여우도령이라고 합니다
              </p>
            </SpeechBubble>
          </div>

          {/* 3. 인연 멘트 + 여우 */}
          <div className="space-y-6">
            <div className="relative">
              {/* 말풍선들을 겹쳐서 배치 */}
              <div className="space-y-4">
                <SpeechBubble className="ml-4">
                  <p className="text-center text-base leading-relaxed" style={{ fontFamily: "'MapoAgape', cursive" }}>
                    {userName}님과 제가<br />
                    이렇게 인연이 닿아
                  </p>
                </SpeechBubble>
                
                <div className="flex justify-end">
                  <FoxCharacter imageSrc="/teaser/fox-character-2.png" alt="여우도령" />
                </div>

                <SpeechBubble className="mr-4">
                  <p className="text-center text-base leading-relaxed" style={{ fontFamily: "'MapoAgape', cursive" }}>
                    사주를 봐드리게 되어<br />
                    정말 기쁘군요 후후..
                  </p>
                </SpeechBubble>
              </div>
            </div>
          </div>

          {/* 4. 사주 표 소개 */}
          <div className="space-y-6">
            <div className="flex justify-start">
              <div className="w-40 h-auto relative">
                <Image 
                  src="/teaser/fox-character-3.png" 
                  alt="여우도령" 
                  width={160}
                  height={224}
                  className="object-contain"
                />
              </div>
            </div>

            <SpeechBubble>
              <p className="text-center text-lg leading-relaxed font-medium" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                먼저 {userName}님의<br />
                사주를 보기 쉽게<br />
                표로 보여드리죠
              </p>
            </SpeechBubble>
          </div>

          {/* 5. 사주팔자 표 (실제 데이터 사용) */}
          <div className="my-12">
            <SajuTable 
              userName={userName}
              birthYear={birthYear}
              birthMonth={birthMonth}
              birthDay={birthDay}
              birthTime={getTimeDisplay(birthTime)}
              sajuData={sajuData}
            />
          </div>

          {/* 6. 해석 멘트 */}
          <div className="space-y-6">
            <div className="flex justify-end">
              <div className="w-40 h-auto relative">
                <Image 
                  src="/teaser/fox-character-4.png" 
                  alt="여우도령" 
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
            </div>

            <SpeechBubble>
              <p className="text-center text-lg leading-relaxed font-medium" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                각 요소에 대한<br />
                해석은 모두 꼼꼼하게<br />
                해드릴 거예요
              </p>
            </SpeechBubble>
          </div>

          {/* 7. 대운표 (블러 처리) */}
          <div className="relative">
            <div className="filter blur-sm">
              <div className="border border-[#E2DCC4] rounded-lg p-1 bg-white">
                <div className="border border-[#9D9A87] rounded-lg overflow-hidden">
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{userName}님의 대운표</h3>
                    <p className="text-sm text-[#9D9A87] mt-1">
                      {userName}님의 대운주기는<br />
                      1세부터 시작해 10년 주기로 찾아와요.
                    </p>
                  </div>
                  <div className="h-40 bg-[#F1EDDD]"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg border-2 border-gray-800 flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                전체 사주 보기
              </div>
            </div>
          </div>

          {/* 8. 오행표 (블러 처리) */}
          <div className="relative">
            <div className="filter blur-sm">
              <div className="border border-[#E2DCC4] rounded-lg p-1 bg-white">
                <div className="border border-[#9D9A87] rounded-lg overflow-hidden">
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{userName}님의 오행표</h3>
                  </div>
                  <div className="p-4">
                    <div className="relative w-full aspect-square">
                      <Image 
                        src="/teaser/ohang-chart.png" 
                        alt="오행표" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg border-2 border-gray-800 flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                전체 사주 보기
              </div>
            </div>
          </div>

          {/* 9. CTA */}
          <div className="py-12 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-800 shadow-2xl">
              <p className="text-center text-lg leading-relaxed mb-6" style={{ fontFamily: "'Noto Serif KR', serif" }}>
                <span className="font-bold text-amber-700">{userName}</span>님!<br />
                지금까지 보신 것은 당신의 사주 중<br />
                아주 작은 일부분입니다.<br /><br />
                전체 사주를 통해 당신의<br />
                <span className="font-bold text-amber-700">과거, 현재, 미래</span>를<br />
                상세히 알아보시겠어요? ✨
              </p>

              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-6 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-gray-800"
                size="lg"
              >
                전체 사주 보기 (29,800원)
              </Button>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-2xl mb-1">✅</div>
                  <div className="font-semibold">정통 만세력</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🤖</div>
                  <div className="font-semibold">AI 맞춤 분석</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">📱</div>
                  <div className="font-semibold">웹툰 형식</div>
                </div>
              </div>
            </div>
          </div>

          {/* 장식 요소들 (피그마에 있는 스슥 텍스트 등) */}
          <div className="fixed top-20 right-4 text-6xl opacity-20 pointer-events-none" style={{ fontFamily: "'Ownglyph Coldywebtoonmaker', cursive" }}>
            스
          </div>
          <div className="fixed top-32 right-8 text-6xl opacity-20 pointer-events-none" style={{ fontFamily: "'Ownglyph Coldywebtoonmaker', cursive" }}>
            슥
          </div>

          {/* 세로 텍스트 (여우도령, 정통사주) */}
          <div className="fixed top-12 right-8 opacity-30 pointer-events-none">
            <div className="flex flex-col text-5xl font-bold leading-tight tracking-wider" style={{ 
              fontFamily: "'Yeongwol', serif",
              writingMode: 'vertical-rl',
              WebkitTextStroke: '2px white',
              color: 'black'
            }}>
              여우도령
            </div>
          </div>
          <div className="fixed top-48 right-24 opacity-30 pointer-events-none">
            <div className="flex flex-col text-4xl font-bold leading-tight tracking-wider" style={{ 
              fontFamily: "'Yeongwol', serif",
              writingMode: 'vertical-rl',
              WebkitTextStroke: '2px white',
              color: 'black'
            }}>
              정통사주
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
