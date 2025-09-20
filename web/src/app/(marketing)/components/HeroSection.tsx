/**
 * 히어로 섹션 컴포넌트
 * 랜딩페이지의 메인 히어로 영역을 담당하는 재사용 가능한 컴포넌트
 */

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  visual?: React.ReactNode;
  className?: string;
}

export function HeroSection({ 
  title, 
  subtitle, 
  description, 
  visual,
  className = '' 
}: HeroSectionProps) {
  return (
    <section className={`py-8 md:py-12 lg:py-16 text-center ${className}`}>
      {visual && (
        <div className="flex justify-center mb-6 md:mb-8">
          {visual}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-500 max-w-[65ch] mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </section>
  );
}
