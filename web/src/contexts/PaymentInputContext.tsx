'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';

/**
 * 사주 입력 폼 데이터 타입
 */
export interface SajuFormData {
  name: string;
  gender: 'male' | 'female' | '';
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthHourUnknown: boolean;
  phoneNumber: string;
  question: string;
}

/**
 * 결제 입력 상태 타입 정의
 */
interface PaymentInputState {
  formData: SajuFormData | null;
  isReady: boolean;
}

/**
 * 결제 입력 컨텍스트 액션 타입 정의
 */
interface PaymentInputActions {
  setFormData: (data: SajuFormData) => void;
  clearFormData: () => void;
  validateFormData: (data: SajuFormData) => boolean;
}

/**
 * 결제 입력 컨텍스트 타입 정의
 */
type PaymentInputContextType = PaymentInputState & PaymentInputActions;

/**
 * 결제 입력 컨텍스트 생성
 */
const PaymentInputContext = createContext<PaymentInputContextType | undefined>(undefined);

/**
 * PaymentInputProvider Props 타입
 */
interface PaymentInputProviderProps {
  children: ReactNode;
}

/**
 * 결제 입력 데이터 관리 Provider
 * 사주 입력 폼 데이터를 전역으로 관리하고 세션 스토리지에 저장
 */
export function PaymentInputProvider({ children }: PaymentInputProviderProps) {
  const [formData, setFormDataState] = useState<SajuFormData | null>(null);

  /**
   * 폼 데이터 유효성 검사
   */
  const validateFormData = useCallback((data: SajuFormData): boolean => {
    return !!(
      data.name?.trim() &&
      data.gender &&
      data.birthYear &&
      data.birthMonth &&
      data.birthDay &&
      (data.birthHour || data.birthHourUnknown) &&
      data.phoneNumber?.trim()
    );
  }, []);

  /**
   * 폼 데이터 설정
   */
  const setFormData = useCallback((data: SajuFormData) => {
    setFormDataState(data);
    // 세션 스토리지에 저장
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sajuFormData', JSON.stringify(data));
    }
  }, []);

  /**
   * 폼 데이터 초기화
   */
  const clearFormData = useCallback(() => {
    setFormDataState(null);
    // 세션 스토리지에서 제거
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sajuFormData');
    }
  }, []);

  /**
   * 컴포넌트 마운트 시 세션 스토리지에서 데이터 복원
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('sajuFormData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as SajuFormData;
          setFormDataState(parsedData);
        } catch (error) {
          console.error('Failed to parse stored form data:', error);
          sessionStorage.removeItem('sajuFormData');
        }
      }
    }
  }, []);

  /**
   * 폼 데이터 준비 상태 계산
   */
  const isReady = useMemo(() => {
    return formData ? validateFormData(formData) : false;
  }, [formData, validateFormData]);

  /**
   * 컨텍스트 값 메모이제이션
   */
  const value = useMemo(() => ({
    formData,
    isReady,
    setFormData,
    clearFormData,
    validateFormData,
  }), [formData, isReady, setFormData, clearFormData, validateFormData]);

  return (
    <PaymentInputContext.Provider value={value}>
      {children}
    </PaymentInputContext.Provider>
  );
}

/**
 * usePaymentInput 훅
 * 결제 입력 상태와 액션을 반환
 */
export function usePaymentInput(): PaymentInputContextType {
  const context = useContext(PaymentInputContext);
  if (context === undefined) {
    throw new Error('usePaymentInput must be used within a PaymentInputProvider');
  }
  return context;
}
