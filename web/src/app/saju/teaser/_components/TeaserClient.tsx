'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Star
} from 'lucide-react';
import { getElementIcon, ELEMENT_INFO } from '@/lib/saju/element';
import type { Element } from '@/lib/saju/element';

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
 * TeaserClient Props
 */
interface TeaserClientProps {
  teaserData: TeaserData;
  userName: string;
}

/**
 * 티저 페이지 클라이언트 컴포넌트
 * 인터랙션과 애니메이션을 담당합니다
 */
export function TeaserClient({ teaserData, userName }: TeaserClientProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // 애니메이션 효과를 위한 딜레이
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  /**
   * 결제 페이지로 이동
   * source=teaser 파라미터를 추가하여 출처를 추적합니다
   */
  const handleContinue = () => {
    router.push('/saju/payment?source=teaser&price=29800');
  };

  // 오행 찾기 (elementName에서 한자 추출)
  const elementKey = Object.keys(ELEMENT_INFO).find(
    key => ELEMENT_INFO[key as Element].name === teaserData.elementName
  ) as Element | undefined;

  const elementInfo = elementKey ? ELEMENT_INFO[elementKey] : ELEMENT_INFO['木'];
  const ElementIcon = getElementIcon(elementInfo.iconName, 'w-8 h-8');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-block animate-bounce mb-4">
            <Sparkles className="w-16 h-16 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold text-purple-900 mb-3">
            당신의 운명이 펼쳐집니다
          </h1>
          <p className="text-lg text-gray-700">
            {userName}님의 사주를 분석 중...
          </p>
        </div>

        {/* 메인 티저 카드 */}
        <div 
          className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Card className="shadow-2xl border-2 border-purple-200 overflow-hidden">
            <div className={`${elementInfo.bgColor} p-8`}>
              {/* 오행 아이콘 */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-6 rounded-full shadow-lg">
                  <ElementIcon className={`w-8 h-8 ${elementInfo.color}`} />
                </div>
              </div>

              {/* 오행 정보 */}
              <CardContent className="text-center space-y-6">
                <div>
                  <h2 className={`text-3xl font-bold ${elementInfo.color} mb-2`}>
                    {teaserData.zodiacEmoji} {teaserData.zodiacName}띠 × {elementInfo.name}
                  </h2>
                  <p className="text-xl text-gray-700 font-semibold">
                    {teaserData.energy}
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                  <p className="text-gray-800 mb-4 leading-relaxed">
                    {teaserData.summary}
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 italic">
                      "{elementInfo.teaser}"
                    </p>
                  </div>
                </div>

                {/* 흐림 효과가 있는 추가 힌트 */}
                <div className="relative" aria-hidden="true">
                  <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border-2 border-dashed border-purple-300">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Star className="w-5 h-5 text-purple-500" />
                      <p className="font-bold text-purple-900">
                        아직 더 많은 비밀이 숨겨져 있습니다
                      </p>
                      <Star className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-gray-600 space-y-2 blur-sm select-none">
                      <p>• 당신의 재물운은...</p>
                      <p>• 연애운과 결혼운은...</p>
                      <p>• 올해의 특별한 운세는...</p>
                      <p>• 당신에게 맞는 직업은...</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg">
                      🔒 전체 결과 보기
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* 여우 캐릭터 메시지 */}
        <div className="mt-8 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-purple-200 relative">
            <div className="absolute -top-4 left-8 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              여우도령이 말합니다
            </div>
            <p className="text-gray-800 text-lg leading-relaxed pt-4">
              <span className="font-bold text-purple-600">{userName}</span>님! 
              지금까지 보신 것은 당신의 사주 중 아주 작은 일부분입니다. 
              전체 사주를 통해 당신의 <span className="font-bold text-purple-600">과거, 현재, 미래</span>를 
              상세히 알아보시겠어요? ✨
            </p>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            size="lg"
            aria-label="전체 사주 결과를 보러 결제 페이지로 이동"
          >
            전체 사주 보기 (29,800원)
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              • 정통 만세력 기반 정확한 해석
            </p>
            <p className="text-sm text-gray-500">
              • AI가 분석한 맞춤형 조언
            </p>
            <p className="text-sm text-gray-500">
              • 웹툰 형식의 재미있는 결과
            </p>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="mt-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              결제는 토스페이먼츠를 통해 안전하게 처리됩니다. 
              결제 후 즉시 결과를 확인하실 수 있습니다.
            </AlertDescription>
          </Alert>
        </div>

        {/* prefetch를 위한 숨겨진 Link */}
        <Link href="/saju/payment" prefetch={true} className="hidden" aria-hidden="true">
          결제 페이지 prefetch
        </Link>
      </div>
    </div>
  );
}

