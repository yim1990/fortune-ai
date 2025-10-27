/**
 * 여우도령 정통사주 - 랜딩페이지
 * Next.js 15 App Router 기반 랜딩페이지 컴포넌트
 */

import { landingCopy } from './(marketing)/content/copy';
import { FixedCTA } from './(marketing)/components/FixedCTA';
import { HeroSection } from './(marketing)/components/HeroSection';
import { CopySection } from './(marketing)/components/CopySection';

export default function LandingPage() {
  return (
    <>
      <main className="container mx-auto max-w-screen-md px-4 py-8 lg:py-12 pb-32 md:pb-36">
        {/* Hero Section */}
        <HeroSection
          title={landingCopy.hero.title}
          subtitle={landingCopy.hero.subtitle}
          description={landingCopy.hero.description}
        />

        {/* Content Sections */}
        {landingCopy.sections.map((section) => (
          <CopySection
            key={section.id}
            heading={section.heading}
            subheading={section.subheading}
            bullets={section.bullets}
          />
        ))}
      </main>

      {/* Fixed CTA Button */}
      <FixedCTA />
    </>
  );
}
