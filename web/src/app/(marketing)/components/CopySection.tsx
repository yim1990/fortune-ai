/**
 * 카피 섹션 컴포넌트
 * 제목, 부제목, 불릿 포인트 리스트를 표시하는 재사용 가능한 컴포넌트
 */

interface CopySectionProps {
  heading: string;
  subheading?: string;
  bullets: string[];
  visual?: React.ReactNode;
  className?: string;
}

export function CopySection({ 
  heading, 
  subheading, 
  bullets, 
  visual,
  className = '' 
}: CopySectionProps) {
  return (
    <section className={`py-8 md:py-12 lg:py-16 ${className}`}>
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-balance">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-3 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            {subheading}
          </p>
        )}
        {visual && (
          <div className="flex justify-center mt-6">
            {visual}
          </div>
        )}
      </div>
      
      <div className="mx-auto max-w-[65ch]">
        <ul className="space-y-3 md:space-y-4">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-pink-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full"></div>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                {bullet}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
