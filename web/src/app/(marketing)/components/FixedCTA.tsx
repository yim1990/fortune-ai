'use client';

import Link from 'next/link';

/**
 * 페이지 하단 고정형 대형 CTA 버튼 컴포넌트
 * 모든 뷰포트에서 항상 보이는 하단 고정형 CTA
 */

export function FixedCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 pb-[env(safe-area-inset-bottom)]">
      <div className="container mx-auto max-w-screen-md px-4 py-2 md:py-3">
        <Link 
          href="/saju/input" 
          className="block w-full rounded-xl bg-rose-600 px-4 py-3 md:py-4 text-center text-base md:text-lg font-bold text-white shadow-lg transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 active:scale-[0.99] hover:bg-rose-700"
        >
          내 사주 알아보기
        </Link>
      </div>
    </div>
  );
}
