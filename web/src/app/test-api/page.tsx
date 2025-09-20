'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

/**
 * API 테스트 페이지
 * Next.js → PHP API 연동 테스트를 위한 개발자 도구
 */

interface ConvertRequest {
  calendar: 'solar' | 'lunar';
  date: string;
  time: string;
  gender: 'male' | 'female';
  name: string;
  phone: string;
}

interface ConvertResponse {
  ok: boolean;
  data?: {
    lunar_date: string | null;
    saju: {
      year: string;
      month: string;
      day: string;
      hour: string;
    };
    elements: {
      heavenly_stems: string[];
      earthly_branches: string[];
    };
  };
  code?: string;
  message?: string;
}

export default function TestApiPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ConvertResponse | null>(null);
  const [request, setRequest] = useState<ConvertRequest>({
    calendar: 'solar',
    date: '1990-01-01',
    time: '12:00',
    gender: 'male',
    name: '테스트',
    phone: '010-1234-5678'
  });

  // API 호출 함수
  const callApi = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/convert-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: ConvertResponse = await res.json();
      setResponse(data);

      if (data.ok) {
        toast({
          title: '성공',
          description: 'API 호출이 성공했습니다.',
        });
      } else {
        toast({
          title: '오류',
          description: data.message || 'API 호출에 실패했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      toast({
        title: '오류',
        description: '네트워크 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 프록시 상태 확인
  const checkProxyStatus = async () => {
    try {
      const res = await fetch('/api/convert-proxy', {
        method: 'GET',
      });
      const data = await res.json();
      
      toast({
        title: '프록시 상태',
        description: data.message || '상태 확인 완료',
      });
    } catch (error) {
      toast({
        title: '오류',
        description: '프록시 상태 확인에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API 테스트 페이지</h1>
          <p className="text-muted-foreground mt-2">
            Next.js → PHP API 연동 테스트를 위한 개발자 도구입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 요청 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>요청 데이터</CardTitle>
              <CardDescription>
                만세력 변환 API에 전달할 데이터를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calendar">달력 타입</Label>
                  <Select
                    value={request.calendar}
                    onValueChange={(value: 'solar' | 'lunar') =>
                      setRequest({ ...request, calendar: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar">양력</SelectItem>
                      <SelectItem value="lunar">음력</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">생년월일</Label>
                  <Input
                    id="date"
                    type="date"
                    value={request.date}
                    onChange={(e) => setRequest({ ...request, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">생시</Label>
                  <Input
                    id="time"
                    type="time"
                    value={request.time}
                    onChange={(e) => setRequest({ ...request, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">성별</Label>
                  <Select
                    value={request.gender}
                    onValueChange={(value: 'male' | 'female') =>
                      setRequest({ ...request, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={request.name}
                  onChange={(e) => setRequest({ ...request, name: e.target.value })}
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={request.phone}
                  onChange={(e) => setRequest({ ...request, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={callApi} disabled={loading} className="flex-1">
                  {loading ? '요청 중...' : 'API 호출'}
                </Button>
                <Button onClick={checkProxyStatus} variant="outline">
                  상태 확인
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 응답 결과 */}
          <Card>
            <CardHeader>
              <CardTitle>응답 결과</CardTitle>
              <CardDescription>
                API 호출 결과를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        response.ok ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="font-medium">
                      {response.ok ? '성공' : '실패'}
                    </span>
                    {response.code && (
                      <span className="text-sm text-muted-foreground">
                        ({response.code})
                      </span>
                    )}
                  </div>

                  {response.message && (
                    <p className="text-sm text-muted-foreground">
                      {response.message}
                    </p>
                  )}

                  {response.data && (
                    <div className="space-y-2">
                      <h4 className="font-medium">만세력 데이터</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>음력 날짜:</strong> {response.data.lunar_date || 'N/A'}</p>
                        <p><strong>사주:</strong> {response.data.saju.year}년 {response.data.saju.month}월 {response.data.saju.day}일 {response.data.saju.hour}시</p>
                        <p><strong>천간:</strong> {response.data.elements.heavenly_stems.join(', ')}</p>
                        <p><strong>지지:</strong> {response.data.elements.earthly_branches.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">전체 응답 JSON</h4>
                    <Textarea
                      value={JSON.stringify(response, null, 2)}
                      readOnly
                      className="h-40 text-xs font-mono"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  API를 호출하면 결과가 여기에 표시됩니다.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* cURL 예시 */}
        <Card>
          <CardHeader>
            <CardTitle>cURL 예시</CardTitle>
            <CardDescription>
              터미널에서 직접 API를 테스트할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={`curl -X POST http://localhost:3000/api/convert-proxy \\
  -H "Content-Type: application/json" \\
  -d '{
    "calendar": "solar",
    "date": "1990-01-01",
    "time": "12:00",
    "gender": "male",
    "name": "테스트",
    "phone": "010-1234-5678"
  }'`}
              readOnly
              className="h-20 text-xs font-mono"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
