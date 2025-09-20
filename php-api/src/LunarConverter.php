<?php

namespace FortuneAI;

// PEAR 패키지 경로 설정
set_include_path(get_include_path() . PATH_SEPARATOR . '/opt/homebrew/share/pear');

// oops/KASI_Lunar 패키지 import
// Ref: https://github.com/OOPS-ORG-PHP/KASI-Lunar
// Ref: https://pear.oops.org/docs/oops-Lunar/Lunar/Lunar.html#methoddayfortune
require_once 'KASI_Lunar.php';
require_once 'Lunar.php';

/**
 * 만세력 변환 및 사주 계산 클래스
 */
class LunarConverter
{
    private string $openaiApiKey;
    private $lunar;

    public function __construct(string $openaiApiKey = null)
    {
        // 환경 변수에서 OpenAI API 키 읽기
        $this->openaiApiKey = $openaiApiKey ?? $_ENV['OPENAI_API_KEY'] ?? '';
        $this->lunar = new \oops\Lunar();
    }

    /**
     * 만세력 변환 및 사주 계산 메인 함수
     */
    public function convert(array $input): array
    {
        try {
            // 입력 데이터 검증
            $this->validateInput($input);

            // 날짜 형식 변환 (YYYY-MM-DD → YYYYMMDD)
            $dateString = $this->formatDateString($input['date'], $input['calendar']);
            
            // 만세력 변환 (oops/KASI_Lunar 사용)
            $fortune = $this->lunar->dayfortune($dateString);

            // 시주 계산 (일간 추출)
            $dayStem = mb_substr($fortune->day ?? '갑자', 0, 1);
            $hourStem = $this->getHourStemBranch($input['time'], $dayStem);

            // 결과 구성
            $result = [
                'lunar_date' => $fortune->fmt ?? null,
                'saju' => [
                    'year' => $fortune->year ?? null,
                    'month' => $fortune->month ?? null,
                    'day' => $fortune->day ?? null,
                    'hour' => $hourStem['korean'] ?? null
                ],
                'elements' => [
                    'heavenly_stems' => [
                        mb_substr($fortune->hyear ?? '', 0, 1),
                        mb_substr($fortune->hmonth ?? '', 0, 1),
                        mb_substr($fortune->hday ?? '', 0, 1),
                        mb_substr($hourStem['chinese'] ?? '', 0, 1)
                    ],
                    'earthly_branches' => [
                        mb_substr($fortune->hyear ?? '', 1, 1),
                        mb_substr($fortune->hmonth ?? '', 1, 1),
                        mb_substr($fortune->hday ?? '', 1, 1),
                        mb_substr($hourStem['chinese'] ?? '', 1, 1)
                    ]
                ]//,
                //'interpretation' => $this->openaiApiKey ? $this->generateInterpretation($input, $fortune, $hourStem) : 'AI 해석을 위해서는 OpenAI API 키가 필요합니다.'
            ];

            return $result;

        } catch (\Exception $e) {
            throw new \Exception('만세력 변환 중 오류가 발생했습니다: ' . $e->getMessage());
        }
    }

    /**
     * 입력 데이터 유효성 검사
     */
    private function validateInput(array $input): void
    {
        $requiredFields = ['calendar', 'date', 'time', 'gender', 'name', 'phone'];
        
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                throw new \InvalidArgumentException("필수 필드가 누락되었습니다: {$field}");
            }
        }

        // 날짜 형식 검증
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['date'])) {
            throw new \InvalidArgumentException('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식을 사용하세요.');
        }

        // 시간 형식 검증
        if (!preg_match('/^\d{2}:\d{2}$/', $input['time'])) {
            throw new \InvalidArgumentException('시간 형식이 올바르지 않습니다. HH:MM 형식을 사용하세요.');
        }

        // 성별 검증
        if (!in_array($input['gender'], ['male', 'female'])) {
            throw new \InvalidArgumentException('성별은 male 또는 female이어야 합니다.');
        }

        // 달력 타입 검증
        if (!in_array($input['calendar'], ['solar', 'lunar'])) {
            throw new \InvalidArgumentException('달력 타입은 solar 또는 lunar이어야 합니다.');
        }
    }

    /**
     * 날짜 문자열 형식 변환
     */
    private function formatDateString(string $date, string $calendar): string
    {
        // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
        return str_replace('-', '', $date);
    }

    /**
     * 시주 계산 (시간의 천간지지)
     */
    private function getHourStemBranch(string $time, string $dayStem): array
    {
        // 한자 테이블 (천간/지지 → 한자)
        $stemMap = [
            '갑' => '甲', '을' => '乙', '병' => '丙', '정' => '丁', '무' => '戊',
            '기' => '己', '경' => '庚', '신' => '辛', '임' => '壬', '계' => '癸'
        ];
        $branchMap = [
            '자' => '子', '축' => '丑', '인' => '寅', '묘' => '卯', '진' => '辰', '사' => '巳',
            '오' => '午', '미' => '未', '신' => '申', '유' => '酉', '술' => '戌', '해' => '亥'
        ];

        $hourBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

        $hourStemTable = [
            '갑' => ['갑','을','병','정','무','기','경','신','임','계','갑','을'],
            '을' => ['병','정','무','기','경','신','임','계','갑','을','병','정'],
            '병' => ['무','기','경','신','임','계','갑','을','병','정','무','기'],
            '정' => ['경','신','임','계','갑','을','병','정','무','기','경','신'],
            '무' => ['임','계','갑','을','병','정','무','기','경','신','임','계'],
            '기' => ['임','계','갑','을','병','정','무','기','경','신','임','계'],
            '경' => ['갑','을','병','정','무','기','경','신','임','계','갑','을'],
            '신' => ['병','정','무','기','경','신','임','계','갑','을','병','정'],
            '임' => ['무','기','경','신','임','계','갑','을','병','정','무','기'],
            '계' => ['경','신','임','계','갑','을','병','정','무','기','경','신']
        ];

        // 시간 파싱 (HH:MM → HHMM)
        $timeString = str_replace(':', '', $time);
        $hour = intval(substr($timeString, 0, 2));
        $minute = intval(substr($timeString, 2, 2));

        // 지지 인덱스 계산
        $totalMinutes = $hour * 60 + $minute;
        $branchIndex = intval(($totalMinutes + 60) / 120) % 12;

        $branch = $hourBranches[$branchIndex];

        // 안전성 체크
        if (!isset($hourStemTable[$dayStem])) {
            throw new \InvalidArgumentException("Invalid day stem: {$dayStem}");
        }

        $stem = $hourStemTable[$dayStem][$branchIndex];

        return [
            'korean' => $stem . $branch,
            'chinese' => ($stemMap[$stem] ?? $stem) . ($branchMap[$branch] ?? $branch)
        ];
    }

    /**
     * AI 해석 생성
     */
    private function generateInterpretation(array $input, $fortune, array $hourStem): string
    {
        $genderText = $input['gender'] === 'male' ? '남성' : '여성';
        $prompt = "생년월일: {$input['date']} (양력)
성별: {$genderText}
연주: {$fortune->hyear}
월주: {$fortune->hmonth}
일주: {$fortune->hday}
시주: {$hourStem['chinese']}";

        $postData = [
            'model' => 'gpt-4o',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => "사주를 봐주면 좋겠는데 특히 [" . ($input['problem'] ?? '전반적인 사주') . "] 부분을 위주로 설명해주세요. 항목별로 질문을 여러번 할 예정이라 전체적인 사주를 요약해줄 필요는 없습니다. 친절한 여성 카운셀러가 사려깊게 말하는 말투로 최대한 자세하게 풀어주세요. 감성적인 문장으로 써주고 예시를 많이 들어서 문장을 길게 설명해주세요. 처음 시작할 때와 마칠 때 인사 할 필요 없이 본론만 이야기해주세요. 차근차근 단계적으로 생각해서 알려주세요."
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'top_p' => 1,
            'presence_penalty' => 0,
            'frequency_penalty' => 0,
            'max_completion_tokens' => 2000
        ];

        $url = 'https://api.openai.com/v1/chat/completions';
        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->openaiApiKey,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) {
            return 'AI 해석 생성에 실패했습니다.';
        }

        $result = json_decode($response, true);

        if (isset($result['choices'][0]['message']['content'])) {
            return $result['choices'][0]['message']['content'];
        } else {
            return 'AI 응답 파싱에 실패했습니다.';
        }
    }
}
