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
  sipseong: string[];
  sipseong_ji: string[];
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
 * Figma 210:3 구조를 기반으로 구현
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

  const handleContinue = () => {
    router.push('/saju/payment?source=teaser&price=29800');
  };

  return (
    <div className="bg-white flex justify-center relative w-full">
      {/* 모바일 너비 고정 컨테이너 (375px) - 전체 높이 4130px */}
      <div className="w-full max-w-[375px] relative bg-white" style={{ minHeight: '4130px' }}>
        
        {/* image 42: 상단 배경 이미지 */}
        <div className="absolute left-0 top-0 w-[375px] h-[720px] overflow-hidden">
          <Image 
            src="/teaser/background.png" 
            alt="배경" 
            fill
            className="object-cover"
            priority
          />
          
          {/* 큰 여우 캐릭터 (좌측 잘림) */}
          <div className="absolute left-[-155px] top-[230px] w-[490px] h-[490px]">
            <Image 
              src="/teaser/fox-character-1.png" 
              alt="여우도령" 
              width={490}
              height={490}
              className="object-cover"
            />
          </div>

          {/* 하단 그라데이션 */}
          <div className="absolute bottom-0 left-0 right-0 h-[174px] bg-gradient-to-b from-transparent to-white"></div>

          {/* 세로 텍스트: 여우도령 */}
          <div className="absolute right-[21px] top-[49px] w-[60px] h-[288px]">
            <Image 
              src="/teaser/text-yeowoodoryeong.png" 
              alt="여우도령" 
              width={60}
              height={288}
              className="object-contain"
            />
          </div>

          {/* 세로 텍스트: 정통사주 */}
          <div className="absolute right-[98px] top-[220px] w-[55px] h-[288px]">
            <Image 
              src="/teaser/text-jeongtong-saju.png" 
              alt="정통사주" 
              width={55}
              height={288}
              className="object-contain"
            />
          </div>

          {/* 장식 이미지 - 빨간 도장 */}
          <div className="absolute right-[22px] top-[352px] w-[64px] h-[63px]">
            <Image 
              src="/teaser/stamp-decoration.png" 
              alt="도장 장식" 
              width={64}
              height={63}
              className="object-contain"
            />
          </div>
        </div>

        {/* Group 4: 말풍선들 + 여우 섹션 */}
        <div className="absolute left-[20px] top-[773.539px] w-[335px] h-[597.562px]">
          {/* Frame 2: 첫 번째 말풍선 */}
          <div className="absolute left-[72.5px] top-0 w-[239px] h-[54px] z-10">
            <div className="w-full h-full p-1 border-2 border-white bg-transparent">
              <div className="w-full h-full bg-white border border-black flex items-center justify-center px-3">
                <p 
                  className="text-[17px] leading-[1.5] tracking-[-0.68px] font-semibold text-black text-center whitespace-nowrap m-0"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  {userName}님, 만나서 반갑습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Frame 3: 두 번째 말풍선 */}
          <div className="absolute left-[21.5px] top-[114.269px] w-[265px] h-[76px] z-10">
            <div className="w-full h-full p-1 bg-white border-2 border-black">
              <div className="w-full h-full bg-white border border-black flex items-center justify-center px-[14px]">
                <div 
                  className="text-[17px] leading-[1.5] tracking-[-0.68px] font-semibold text-black text-center"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  <p className="m-0">지금부터 {userName}님의 사주를</p>
                  <p className="m-0">알려드릴 여우도령이라고 합니다</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rectangle 3: 여우 캐릭터 박스 */}
          <div className="absolute left-0 top-[140.576px] w-[335px] h-[320px]">
            <div className="absolute inset-0 border border-black overflow-hidden">
              <Image 
                src="/teaser/background.png" 
                alt="배경" 
                fill
                className="object-cover"
              />
              
              {/* 회전된 여우 */}
              <div className="absolute left-[335px] top-[11px] w-[308px] h-[308px]">
                <div className="w-full h-full rotate-180 scale-y-[-1]">
                  <Image 
                    src="/teaser/fox-character-1.png" 
                    alt="여우도령" 
                    width={308}
                    height={308}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Group 1: 인연 멘트 말풍선 */}
          <div className="absolute left-[23px] top-[366.562px] w-[262px] h-[231px]">
            {/* Union 이미지 배경 */}
            <Image 
              src="/teaser/speech-bubble-1.png" 
              alt="말풍선" 
              width={262}
              height={231}
              className="absolute inset-0"
            />

            {/* 첫 번째 멘트 */}
            <div className="absolute left-[45px] top-[57px] w-[136px] h-[48px]">
              <p 
                className="text-[17px] leading-[1.4] tracking-[-0.68px] text-black text-center m-0"
                style={{ fontFamily: "'MapoAgape', cursive" }}
              >
                {userName}님과 제가<br />이렇게 인연이 닿아
              </p>
            </div>

            {/* 두 번째 멘트 */}
            <div className="absolute left-[73px] top-[148px] w-[152px] h-[48px]">
              <p 
                className="text-[17px] leading-[1.4] tracking-[-0.68px] text-black text-center m-0"
                style={{ fontFamily: "'MapoAgape', cursive" }}
              >
                사주를 봐드리게 되어<br />정말 기쁘군요 후후..
              </p>
            </div>
          </div>
        </div>

        {/* Group 5: 사주 소개 + 여우 섹션 */}
        <div className="absolute left-0 top-[1404.914px] w-[375.684px] h-[699.625px]">
          {/* Rectangle 4: 배경 박스 + "스슥" 텍스트 + 반전된 여우 (래스터화된 이미지) */}
          <div className="absolute left-[100.684px] top-0 w-[275px] h-[352px]">
            <Image 
              src="/teaser/decoration-seuk.png" 
              alt="스슥 장식" 
              width={275}
              height={352}
              className="object-cover"
            />
          </div>

          {/* Group 2: 사주 소개 말풍선 */}
          <div className="absolute left-[34.5px] top-[260.125px] w-[250px] h-[148px]">
            {/* Union 이미지 말풍선 */}
            <Image 
              src="/teaser/speech-bubble-2.png" 
              alt="말풍선" 
              width={250}
              height={148}
              className="absolute inset-0"
            />

            {/* 텍스트 */}
            <div className="absolute left-[64.5px] top-[26.5px] w-[119px] h-[78px]">
              <p 
                className="text-[17px] leading-[1.5] tracking-[-0.68px] font-semibold text-black text-center m-0"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                먼저 {userName}님의<br />사주를 보기 쉽게<br />표로 보여드리죠
              </p>
            </div>
          </div>

          {/* Rectangle 5: 아래쪽 여우 섹션 */}
          <div className="absolute left-0 top-[379.625px] w-[375px] h-[320px]">
            {/* 배경 박스 */}
            <div className="absolute left-[20px] top-[73px] w-[335px] h-[244px] border border-black">
              <Image 
                src="/teaser/background.png" 
                alt="배경" 
                fill
                className="object-cover"
              />
            </div>

            {/* 여우 캐릭터 */}
            <div className="absolute left-[39px] top-0 w-[317px] h-[317px] z-10">
              <Image 
                src="/teaser/fox-character-4.png" 
                alt="여우도령" 
                width={317}
                height={317}
                className="object-cover"
              />
            </div>

            {/* 그라데이션 */}
            <div className="absolute left-0 bottom-0 w-[375px] h-[131px] bg-gradient-to-b from-transparent to-white"></div>
          </div>
        </div>

        {/* Group 3: 마지막 말풍선 + 여우 */}
        <div className="absolute left-[94px] top-[2111.939px] w-[271px] h-[167px]">
          {/* Ellipse 6 - 원형 배경 */}
          <div className="absolute inset-0">
            <Image 
              src="/teaser/ellipse-bg.png" 
              alt="배경" 
              width={271}
              height={167}
              className="object-contain"
            />
          </div>

          {/* 텍스트 */}
          <div className="absolute left-[31px] top-[74.6px] w-[150px] h-[78px]">
            <p 
              className="text-[17px] leading-[1.5] tracking-[-0.68px] font-semibold text-black text-center m-0"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
              각 요소에 대한<br />해석은 모두 꼼꼼하게<br />해드릴 거예요
            </p>
          </div>
        </div>

        {/* 사주 표 전체 */}
        <div className="absolute left-[16px] top-[2309.5px] w-[343px]">
          <SajuTable 
            userName={userName}
            birthYear={birthYear}
            birthMonth={birthMonth}
            birthDay={birthDay}
            birthTime={getTimeDisplay(birthTime)}
            sajuData={sajuData}
          />
        </div>

        {/* Frame 55: 대운표 */}
        <div className="absolute left-[20px] top-[3264.539px] w-[343px] h-[278px]">
          <div className="border border-[#e2dcc4] rounded-lg p-1 bg-white w-full h-full">
            <div className="border border-[#9d9a87] rounded-lg overflow-hidden bg-white h-[270px]">
              <div className="pt-8 text-center">
                <p 
                  className="text-[36px] leading-[1.2] font-bold text-black m-0"
                  style={{ fontFamily: "'Yydimibang OTF', serif" }}
                >
                  {userName}님의 대운표
                </p>
                <div 
                  className="text-[15px] text-[#9d9a87] mt-1 font-semibold tracking-[-0.6px] leading-[1.45]"
                  style={{ fontFamily: "'Noto Serif KR', serif" }}
                >
                  <p className="m-0">{userName}님의 대운주기는</p>
                  <p className="m-0">1세부터 시작해 10년 주기로 찾아와요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frame 56: 오행표 */}
        <div className="absolute left-[20px] top-[3595.539px] w-[343px] h-[402px]">
          <div className="border border-[#e2dcc4] rounded-lg p-1 bg-white w-full h-full">
            <div className="border border-[#9d9a87] rounded-lg overflow-hidden bg-white h-[394px]">
              <div className="pt-8 text-center">
                <p 
                  className="text-[36px] leading-[1.2] font-bold text-black m-0"
                  style={{ fontFamily: "'Yydimibang OTF', serif" }}
                >
                  {userName}님의 오행표
                </p>
              </div>
              <div className="px-4 mt-4 flex justify-center">
                <div className="w-[312px] h-[312px] relative">
                  <Image 
                    src="/teaser/ohang-chart.png" 
                    alt="오행표" 
                    width={312}
                    height={312}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="absolute left-[16px] top-[4035px] right-[16px]">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-800 shadow-2xl">
            <p 
              className="text-center text-lg leading-relaxed mb-6"
              style={{ fontFamily: "'Noto Serif KR', serif" }}
            >
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
      </div>
    </div>
  );
}
