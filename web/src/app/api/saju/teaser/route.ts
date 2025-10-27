import { NextRequest, NextResponse } from 'next/server';
import { calculateZodiac } from '@/lib/saju/zodiac';
import { calculateElement } from '@/lib/saju/element';

/**
 * 티저 API 응답 타입
 */
interface TeaserResponse {
  energy: string;
  summary: string;
  foxLine: string;
  zodiacName: string;
  zodiacEmoji: string;
  elementName: string;
  elementKeyword: string;
}

/**
 * 사주 티저 데이터 생성 API
 * 생년월일과 성별을 받아 간단한 프리셋 기반 티저 메시지를 반환합니다.
 * 
 * POST /api/saju/teaser
 * Body: { birth: 'YYYY-MM-DD', gender: 'male' | 'female' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birth, gender } = body;

    // 필수 파라미터 검증
    if (!birth) {
      return NextResponse.json(
        { error: '생년월일(birth)은 필수입니다.' },
        { status: 400 }
      );
    }

    // 생년월일 파싱
    const birthDate = new Date(birth);
    if (isNaN(birthDate.getTime())) {
      return NextResponse.json(
        { error: '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;

    // 12지지와 오행 계산
    const zodiacInfo = calculateZodiac(birthYear);
    const elementInfo = calculateElement(birthYear);

    // 계절 기반 추가 메시지 (월 기준)
    const seasonMessage = getSeasonMessage(birthMonth);

    // 성별에 따른 맞춤 메시지
    const genderMessage = gender === 'female' ? '당신은 섬세한 감각' : '당신은 강한 의지';

    // 티저 데이터 생성
    const teaserData: TeaserResponse = {
      energy: `${zodiacInfo.keyword} + ${elementInfo.keyword}`,
      summary: `${zodiacInfo.emoji} ${zodiacInfo.name}띠이신 당신은 ${elementInfo.name}의 기운과 함께 ${seasonMessage}`,
      foxLine: `${genderMessage}을 가지고 계시군요! ${zodiacInfo.teaser.slice(0, 50)}`,
      zodiacName: zodiacInfo.name,
      zodiacEmoji: zodiacInfo.emoji,
      elementName: elementInfo.name,
      elementKeyword: elementInfo.keyword,
    };

    // 캐시 비활성화 헤더 설정
    return NextResponse.json(teaserData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Teaser API error:', error);
    return NextResponse.json(
      { error: '티저 데이터 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 계절별 메시지 반환
 * @param month 월 (1-12)
 * @returns 계절 메시지
 */
function getSeasonMessage(month: number): string {
  if (month >= 3 && month <= 5) {
    return '봄의 생동감 넘치는 에너지를 품고 있습니다';
  } else if (month >= 6 && month <= 8) {
    return '여름의 뜨거운 열정을 가지고 있습니다';
  } else if (month >= 9 && month <= 11) {
    return '가을의 풍요로운 결실을 맺을 운명입니다';
  } else {
    return '겨울의 차분한 지혜를 지니고 있습니다';
  }
}

