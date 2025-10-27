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
 * 사주 티저 페이지 (서버 컴포넌트)
 * 
 * 쿼리 파라미터로 생년월일과 성별 정보를 받아 간단한 사주 미리보기를 제공합니다.
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
  const { birth, gender, name } = params;

  // 필수 파라미터 검증
  if (!birth || !gender) {
    // 파라미터가 없으면 입력 페이지로 리다이렉트
    redirect('/saju/input');
  }

  try {
    // 티저 API 호출
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/saju/teaser`, {
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

    if (!response.ok) {
      throw new Error('티저 데이터를 가져오는데 실패했습니다.');
    }

    const teaserData = await response.json();

    // 클라이언트 컴포넌트로 전달
    return (
      <TeaserClient 
        teaserData={teaserData} 
        userName={name || '고객'}
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
