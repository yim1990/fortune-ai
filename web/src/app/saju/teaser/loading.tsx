import { Sparkles } from 'lucide-react';

/**
 * 티저 페이지 로딩 화면
 * Suspense fallback으로 사용됩니다
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 스켈레톤 */}
        <div className="text-center mb-12">
          <div className="inline-block animate-bounce mb-4">
            <Sparkles className="w-16 h-16 text-purple-500" />
          </div>
          <div className="h-10 bg-purple-200 rounded-lg w-80 mx-auto mb-3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-60 mx-auto animate-pulse"></div>
        </div>

        {/* 메인 카드 스켈레톤 */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          <div className="bg-purple-50 p-8">
            {/* 아이콘 스켈레톤 */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-6 rounded-full shadow-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="text-center space-y-6">
              {/* 제목 스켈레톤 */}
              <div>
                <div className="h-9 bg-purple-200 rounded-lg w-96 mx-auto mb-2 animate-pulse"></div>
                <div className="h-7 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
              </div>

              {/* 내용 스켈레톤 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md space-y-3">
                <div className="h-5 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-5/6 mx-auto animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-4/6 mx-auto animate-pulse"></div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
                </div>
              </div>

              {/* 추가 힌트 스켈레톤 */}
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border-2 border-dashed border-purple-300">
                <div className="h-6 bg-purple-200 rounded-lg w-80 mx-auto mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-60 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-60 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-60 mx-auto animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-60 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 여우 메시지 스켈레톤 */}
        <div className="mt-8 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-200">
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded-lg w-full animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-5/6 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-4/6 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* CTA 버튼 스켈레톤 */}
        <div className="space-y-4">
          <div className="h-16 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg w-full animate-pulse"></div>
          <div className="text-center space-y-2">
            <div className="h-4 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-56 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-60 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="text-center mt-8">
          <p className="text-purple-600 font-semibold animate-pulse">
            당신의 운명을 분석하고 있습니다...
          </p>
        </div>
      </div>
    </div>
  );
}

