import { redirect } from 'next/navigation';
import { TeaserClient } from './_components/TeaserClient';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * 페이지 Props 타입
 */
interface PageProps {
  searchParams: Promise<{
    birth?: string;
    time?: string;
    gender?: string;
    tz?: string;
    name?: string;
  }>;
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
 * 사주 티저 페이지 (서버 컴포넌트)
 * 
 * PHP API를 호출하여 실제 만세력 데이터를 가져옵니다.
 * 
 * @param searchParams - 쿼리 파라미터
 *   - birth: 생년월일 (YYYY-MM-DD)
 *   - time: 출생시간 (HH, optional)
 *   - gender: 성별 (male | female)
 *   - tz: 타임존 (Asia/Seoul, optional)
 *   - name: 이름 (optional)
 */
export default async function SajuTeaserPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { birth, gender, name, time } = params;

  // 필수 파라미터 검증
  if (!birth || !gender) {
    redirect('/saju/input');
  }

  try {
    // 생년월일 파싱
    const [year, month, day] = birth.split('-');
    const birthTime = time ? `${time.padStart(2, '0')}:00` : '12:00'; // 출생시간이 없으면 정오로 설정

    // PHP API 호출 (프록시를 통해)
    // 서버 사이드에서는 내부 URL 사용 (Cloud Run에서는 PORT 환경 변수 사용)
    const port = process.env.PORT || '3000';
    const baseUrl = typeof window === 'undefined' 
      ? `http://localhost:${port}` 
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    
    const convertResponse = await fetch(`${baseUrl}/api/convert-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calendar: 'solar', // 양력 기준
        date: birth,
        time: birthTime,
        gender: gender as 'male' | 'female',
        name: name || '고객',
        phone: '010-0000-0000', // 임시 전화번호
      }),
      cache: 'no-store',
    });

    if (!convertResponse.ok) {
      throw new Error('만세력 변환 실패');
    }

    const convertData = await convertResponse.json();

    if (!convertData.ok || !convertData.data) {
      throw new Error('만세력 데이터가 없습니다');
    }

    const sajuData: SajuData = convertData.data;

    // 티저 데이터 생성 (기존 로직 유지)
    const teaserResponse = await fetch(`${baseUrl}/api/saju/teaser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        birth,
        gender,
      }),
      cache: 'no-store',
    });

    if (!teaserResponse.ok) {
      throw new Error('티저 데이터를 가져오는데 실패했습니다.');
    }

    const teaserData = await teaserResponse.json();

    // 클라이언트 컴포넌트로 전달
    return (
      <TeaserClient 
        teaserData={teaserData} 
        userName={name || '고객'}
        birthYear={year}
        birthMonth={month}
        birthDay={day}
        birthTime={time || 'unknown'}
        sajuData={sajuData}
      />
    );

  } catch (error) {
    console.error('Teaser page error:', error);
    
    // 에러 발생 시 에러 페이지 표시
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              사주 정보를 불러오는 중 오류가 발생했습니다.
              다시 시도해주세요.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/saju/input">
              다시 입력하기
            </Link>
          </Button>
        </div>
      </div>
    );
  }
}
