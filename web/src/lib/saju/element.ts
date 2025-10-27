/**
 * 오행(五行) 관련 유틸리티 함수
 */

import { Wind, Sun, Star, Sparkles, Moon } from 'lucide-react';

/**
 * 오행 타입 정의
 */
export type Element = '木' | '火' | '土' | '金' | '水';

/**
 * 오행 정보 타입
 */
export interface ElementInfo {
  name: string;
  color: string;
  bgColor: string;
  iconName: 'wind' | 'sun' | 'star' | 'sparkles' | 'moon';
  keyword: string;
  description: string;
  teaser: string;
}

/**
 * 오행별 특성 정보 매핑
 */
export const ELEMENT_INFO: Record<Element, ElementInfo> = {
  '木': {
    name: '목(木)',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    iconName: 'wind',
    keyword: '성장과 창의성',
    description: '봄의 기운으로 새로운 시작과 성장을 상징합니다',
    teaser: '당신에게는 새로운 시작의 기운이 강하게 흐르고 있습니다. 창의적인 아이디어로 성공할 가능성이...',
  },
  '火': {
    name: '화(火)',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    iconName: 'sun',
    keyword: '열정과 활력',
    description: '여름의 기운으로 열정과 활력을 상징합니다',
    teaser: '당신의 삶에는 뜨거운 열정의 불꽃이 타오르고 있습니다. 당신의 에너지로 주변을 밝히며...',
  },
  '土': {
    name: '토(土)',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    iconName: 'star',
    keyword: '안정과 신뢰',
    description: '중심의 기운으로 안정과 신뢰를 상징합니다',
    teaser: '당신은 흔들리지 않는 중심을 가진 사람입니다. 사람들이 당신을 믿고 따르는 이유는...',
  },
  '金': {
    name: '금(金)',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    iconName: 'sparkles',
    keyword: '정의와 결단',
    description: '가을의 기운으로 정의와 결단을 상징합니다',
    teaser: '당신에게는 올바른 것을 향한 강한 의지가 있습니다. 중요한 순간에 현명한 결정을...',
  },
  '水': {
    name: '수(水)',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    iconName: 'moon',
    keyword: '지혜와 유연성',
    description: '겨울의 기운으로 지혜와 유연성을 상징합니다',
    teaser: '당신은 물처럼 유연하게 흐르는 지혜를 가지고 있습니다. 어려운 상황도 당신의 지혜로...',
  },
};

/**
 * 생년을 기반으로 오행 계산
 * 천간에 따른 오행 매핑을 사용
 * @param birthYear 생년 (예: 1990)
 * @returns 오행 정보
 */
export function calculateElement(birthYear: number): ElementInfo {
  // 천간에 따른 오행 매핑
  // 갑(甲), 을(乙) -> 木
  // 병(丙), 정(丁) -> 火
  // 무(戊), 기(己) -> 土
  // 경(庚), 신(辛) -> 金
  // 임(壬), 계(癸) -> 水
  
  const lastDigit = birthYear % 10;
  
  let element: Element;
  if (lastDigit === 4 || lastDigit === 5) {
    element = '木';
  } else if (lastDigit === 6 || lastDigit === 7) {
    element = '火';
  } else if (lastDigit === 8 || lastDigit === 9) {
    element = '土';
  } else if (lastDigit === 0 || lastDigit === 1) {
    element = '金';
  } else {
    element = '水';
  }
  
  return ELEMENT_INFO[element];
}

/**
 * 오행 아이콘 컴포넌트 가져오기
 * @param iconName 아이콘 이름
 * @param className 아이콘 클래스명
 * @returns React 컴포넌트
 */
export function getElementIcon(iconName: ElementInfo['iconName'], className: string = 'w-8 h-8') {
  const iconMap = {
    wind: Wind,
    sun: Sun,
    star: Star,
    sparkles: Sparkles,
    moon: Moon,
  };
  
  const IconComponent = iconMap[iconName];
  return IconComponent;
}

