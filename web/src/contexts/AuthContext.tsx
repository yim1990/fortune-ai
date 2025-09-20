'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Member } from '@/types/member';

/**
 * 인증 상태 타입 정의
 */
interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: Member | null;
  initialized: boolean;
}

/**
 * 인증 컨텍스트 액션 타입 정의
 */
interface AuthActions {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * 인증 컨텍스트 타입 정의
 */
type AuthContextType = AuthState & AuthActions;

/**
 * 인증 컨텍스트 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props 타입
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 인증 상태 관리 Provider
 * 세션 및 멤버 정보를 전역으로 관리
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
    user: null,
    initialized: false,
  });


  /**
   * 사용자 정보 새로고침
   * /api/me 엔드포인트를 호출하여 최신 사용자 정보를 가져옴
   */
  const refresh = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const response = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setState({
          loading: false,
          isAuthenticated: !!data.user,
          user: data.user || null,
          initialized: true,
        });
      } else if (response.status === 401) {
        // 인증 실패 시 상태 초기화
        setState({
          loading: false,
          isAuthenticated: false,
          user: null,
          initialized: true,
        });
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      setState({
        loading: false,
        isAuthenticated: false,
        user: null,
        initialized: true,
      });
    }
  };

  /**
   * 로그아웃 처리
   */
  const logout = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setState({
          loading: false,
          isAuthenticated: false,
          user: null,
          initialized: true,
        });
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 발생해도 로컬 상태는 초기화
      setState({
        loading: false,
        isAuthenticated: false,
        user: null,
        initialized: true,
      });
    }
  };

  /**
   * 컴포넌트 마운트 시 초기 사용자 정보 로드
   */
  useEffect(() => {
    refresh();
  }, []);

  /**
   * refresh 함수가 변경될 때마다 useEffect 의존성 업데이트
   */
  const refreshCallback = useCallback(() => {
    refresh();
  }, []);

  /**
   * 윈도우 포커스 복귀 시 재검증
   */
  useEffect(() => {
    const handleFocus = () => {
      if (!state.loading) {
        refreshCallback();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state.loading, refreshCallback]);

  /**
   * 컨텍스트 값 메모이제이션
   */
  const value = useMemo(() => ({
    ...state,
    refresh,
    logout,
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth 훅
 * 인증 상태와 액션을 반환
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * useUser 훅
 * 사용자 정보만 반환 (편의성을 위한 별도 훅)
 */
export function useUser(): Member | null {
  const { user } = useAuth();
  return user;
}
