/**
 * 연화당 정통사주 - 랜딩페이지 카피 데이터
 * 20-30대 여성 타깃을 위한 설득력 있는 카피라이팅
 */

export interface CopySection {
  id: string;
  heading: string;
  subheading: string;
  bullets: string[];
}

export interface LandingCopy {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  sections: CopySection[];
}

export const landingCopy: LandingCopy = {
  hero: {
    title: '내 이야기 같은 정통사주',
    subtitle: '쉽고 재미있게 이해하는 나의 운세',
    description: 'AI와 전통이 만나 새롭게 태어난 사주 서비스. 3분이면 나만의 운세를 웹툰으로 만나보세요.'
  },
  sections: [
    {
      id: 'why',
      heading: '왜 연화당인가',
      subheading: '정통과 재미의 완벽한 조화',
      bullets: [
        '정통 만세력과 AI 해석의 결합으로 정확도와 재미를 동시에',
        '모바일에 최적화된 사용 경험으로 언제 어디서나',
        '결제 후 바로 결과 확인, 기다림 없는 즉시 만족',
        '20-30대 여성을 위한 맞춤형 해석과 디자인'
      ]
    },
    {
      id: 'webtoon',
      heading: '웹툰으로 보는 나의 사주',
      subheading: '여우 캐릭터가 안내하는 나만의 스토리',
      bullets: [
        '잘생긴 여우 캐릭터가 친근하게 설명하는 사주 이야기',
        '핵심만 쏙쏙 요약한 카드형 패널로 한눈에 파악',
        '지루한 텍스트 대신 재미있는 시각적 스토리텔링',
        'SNS에 공유하고 싶은 귀여운 결과 이미지'
      ]
    },
    {
      id: 'fast',
      heading: '3분 만에 나만의 운세 분석',
      subheading: '간단한 입력으로 시작하는 운세 여행',
      bullets: [
        '생년월일시만 입력하면 끝, 복잡한 과정은 NO',
        'AI가 실시간으로 분석하고 웹툰으로 변환',
        '인스타그램 스토리 공유까지 한 번에',
        '언제든 다시 볼 수 있는 나만의 운세 아카이브'
      ]
    }
  ]
};

// A/B 테스트를 위한 대안 카피
export const landingCopyVariant: LandingCopy = {
  hero: {
    title: 'AI가 만든 나만의 사주 웹툰',
    subtitle: '전통 사주를 현대적으로 재해석하다',
    description: '복잡한 사주를 3분 만에 웹툰으로 만나보세요. 정통 만세력과 AI의 만남이 만들어내는 새로운 경험.'
  },
  sections: [
    {
      id: 'why',
      heading: '연화당만의 특별함',
      subheading: '정통과 혁신의 만남',
      bullets: [
        '500년 전통 만세력에 AI 기술을 접목한 혁신적 접근',
        '모바일 퍼스트 디자인으로 언제 어디서나 편리하게',
        '즉시 확인 가능한 실시간 결과 생성',
        '20-30대 여성의 라이프스타일에 맞춘 맞춤 서비스'
      ]
    },
    {
      id: 'webtoon',
      heading: '웹툰으로 만나는 사주',
      subheading: '캐릭터와 함께하는 운세 여행',
      bullets: [
        '매력적인 여우 캐릭터가 친구처럼 설명해주는 사주',
        '복잡한 내용을 직관적인 카드와 패널로 정리',
        '텍스트보다 시각적 스토리로 이해도 극대화',
        'SNS에서 화제가 될 만한 공유하기 좋은 결과물'
      ]
    },
    {
      id: 'fast',
      heading: '빠르고 간편한 운세 확인',
      subheading: '3분이면 완성되는 나만의 사주',
      bullets: [
        '최소한의 정보 입력으로 최대한의 결과 얻기',
        'AI가 실시간 분석하여 웹툰으로 즉시 변환',
        '원클릭 SNS 공유로 친구들과 운세 공유',
        '개인 계정에 저장되어 언제든 다시 확인 가능'
      ]
    }
  ]
};
