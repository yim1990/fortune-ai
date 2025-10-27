/**
 * 티저 페이지 로딩 컴포넌트
 * 서버에서 데이터를 가져오는 동안 표시되는 로딩 화면
 */
export default function TeaserLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 여우 캐릭터 애니메이션 */}
        <div className="mb-8 animate-bounce">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-2xl border-4 border-white">
            <span className="text-6xl">🦊</span>
          </div>
        </div>
        
        {/* 로딩 텍스트 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            사주를 분석하고 있습니다
          </h2>
          <p className="text-gray-600">
            잠시만 기다려주세요...
          </p>
          
          {/* 로딩 바 */}
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-600 to-orange-600 animate-pulse rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
