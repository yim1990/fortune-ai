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

            // 천간 추출
            $heavenlyStems = [
                mb_substr($fortune->hyear ?? '', 0, 1),
                mb_substr($fortune->hmonth ?? '', 0, 1),
                mb_substr($fortune->hday ?? '', 0, 1),
                mb_substr($hourStem['chinese'] ?? '', 0, 1)
            ];

            // 지지 추출
            $earthlyBranches = [
                mb_substr($fortune->hyear ?? '', 1, 1),
                mb_substr($fortune->hmonth ?? '', 1, 1),
                mb_substr($fortune->hday ?? '', 1, 1),
                mb_substr($hourStem['chinese'] ?? '', 1, 1)
            ];

            // 십성 계산 (일간 기준)
            $sipseong = $this->calculateSipseong($dayStem, $heavenlyStems);
            
            // 지지의 십성 계산 (지지를 대표 천간으로 변환 후 계산)
            $sipseongJi = $this->calculateSipseongFromBranches($dayStem, $earthlyBranches);

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
                    'heavenly_stems' => $heavenlyStems,
                    'earthly_branches' => $earthlyBranches
                ],
                'sipseong' => $sipseong,
                'sipseong_ji' => $sipseongJi//,
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
     * 십성(十聖) 계산 함수
     * 일간을 기준으로 각 천간의 십성을 계산
     * 
     * @param string $dayStem 일간(日干)
     * @param array $heavenlyStems 천간 배열 [년간, 월간, 일간, 시간]
     * @return array 십성 정보
     */
    private function calculateSipseong(string $dayStem, array $heavenlyStems): array
    {
        $sipseongResult = [];

        // 한자 → 한글 변환 맵
        $chineseToKorean = [
            '甲' => '갑', '乙' => '을', '丙' => '병', '丁' => '정', '戊' => '무',
            '己' => '기', '庚' => '경', '辛' => '신', '壬' => '임', '癸' => '계'
        ];

        foreach ($heavenlyStems as $index => $stem) {
            // 한자 천간을 한글로 변환
            $koreanStem = $chineseToKorean[$stem] ?? $stem;
            
            // 십성 계산
            $sipseongResult[] = $this->getSipseongRelation($dayStem, $koreanStem);
        }

        return $sipseongResult;
    }

    /**
     * 지지의 십성 계산 함수
     * 지지를 대표 천간으로 변환 후 십성을 계산
     * 
     * @param string $dayStem 일간(日干)
     * @param array $earthlyBranches 지지 배열 [년지, 월지, 일지, 시지]
     * @return array 십성 정보
     */
    private function calculateSipseongFromBranches(string $dayStem, array $earthlyBranches): array
    {
        $sipseongResult = [];

        // 지지 → 대표 천간 변환 맵 (지장간 중 정기)
        $branchToStem = [
            '子' => '계', // 자수
            '丑' => '기', // 축토
            '寅' => '갑', // 인목
            '卯' => '을', // 묘목
            '辰' => '무', // 진토
            '巳' => '병', // 사화
            '午' => '정', // 오화
            '未' => '기', // 미토
            '申' => '경', // 신금
            '酉' => '신', // 유금
            '戌' => '무', // 술토
            '亥' => '임'  // 해수
        ];

        foreach ($earthlyBranches as $index => $branch) {
            // 지지를 대표 천간으로 변환
            $representativeStem = $branchToStem[$branch] ?? '';
            
            if ($representativeStem) {
                // 십성 계산
                $sipseongResult[] = $this->getSipseongRelation($dayStem, $representativeStem);
            } else {
                $sipseongResult[] = '알 수 없음';
            }
        }

        return $sipseongResult;
    }

    /**
     * 두 천간 사이의 십성 관계 계산
     * 
     * @param string $dayStem 일간(日干) - 기준
     * @param string $targetStem 대상 천간
     * @return string 십성명
     */
    private function getSipseongRelation(string $dayStem, string $targetStem): string
    {
        // 천간의 오행과 음양 정보
        $stemInfo = $this->getStemInfo($dayStem);
        $targetInfo = $this->getStemInfo($targetStem);

        // 동일한 천간인 경우 (일간 자신)
        if ($dayStem === $targetStem) {
            return '비견';
        }

        // 오행이 같은 경우
        if ($stemInfo['element'] === $targetInfo['element']) {
            // 음양이 다르면 겁재
            return $stemInfo['yin_yang'] !== $targetInfo['yin_yang'] ? '겁재' : '비견';
        }

        // 일간이 생하는 오행인 경우 (목생화, 화생토, 토생금, 금생수, 수생목)
        if ($this->isGenerating($stemInfo['element'], $targetInfo['element'])) {
            return $stemInfo['yin_yang'] === $targetInfo['yin_yang'] ? '식신' : '상관';
        }

        // 일간이 극하는 오행인 경우 (목극토, 토극수, 수극화, 화극금, 금극목)
        if ($this->isControlling($stemInfo['element'], $targetInfo['element'])) {
            return $stemInfo['yin_yang'] === $targetInfo['yin_yang'] ? '편재' : '정재';
        }

        // 일간을 극하는 오행인 경우
        if ($this->isControlling($targetInfo['element'], $stemInfo['element'])) {
            return $stemInfo['yin_yang'] === $targetInfo['yin_yang'] ? '편관' : '정관';
        }

        // 일간을 생하는 오행인 경우
        if ($this->isGenerating($targetInfo['element'], $stemInfo['element'])) {
            return $stemInfo['yin_yang'] === $targetInfo['yin_yang'] ? '편인' : '정인';
        }

        return '알 수 없음';
    }

    /**
     * 천간의 오행과 음양 정보 조회
     * 
     * @param string $stem 천간
     * @return array ['element' => 오행, 'yin_yang' => 음양]
     */
    private function getStemInfo(string $stem): array
    {
        $stemInfoMap = [
            '갑' => ['element' => '목', 'yin_yang' => '양'],
            '을' => ['element' => '목', 'yin_yang' => '음'],
            '병' => ['element' => '화', 'yin_yang' => '양'],
            '정' => ['element' => '화', 'yin_yang' => '음'],
            '무' => ['element' => '토', 'yin_yang' => '양'],
            '기' => ['element' => '토', 'yin_yang' => '음'],
            '경' => ['element' => '금', 'yin_yang' => '양'],
            '신' => ['element' => '금', 'yin_yang' => '음'],
            '임' => ['element' => '수', 'yin_yang' => '양'],
            '계' => ['element' => '수', 'yin_yang' => '음']
        ];

        return $stemInfoMap[$stem] ?? ['element' => '알 수 없음', 'yin_yang' => '알 수 없음'];
    }

    /**
     * 오행 상생 관계 확인 (A가 B를 생하는가?)
     * 목생화, 화생토, 토생금, 금생수, 수생목
     * 
     * @param string $elementA 생하는 오행
     * @param string $elementB 생을 받는 오행
     * @return bool
     */
    private function isGenerating(string $elementA, string $elementB): bool
    {
        $generatingMap = [
            '목' => '화',  // 목생화
            '화' => '토',  // 화생토
            '토' => '금',  // 토생금
            '금' => '수',  // 금생수
            '수' => '목'   // 수생목
        ];

        return isset($generatingMap[$elementA]) && $generatingMap[$elementA] === $elementB;
    }

    /**
     * 오행 상극 관계 확인 (A가 B를 극하는가?)
     * 목극토, 토극수, 수극화, 화극금, 금극목
     * 
     * @param string $elementA 극하는 오행
     * @param string $elementB 극을 받는 오행
     * @return bool
     */
    private function isControlling(string $elementA, string $elementB): bool
    {
        $controllingMap = [
            '목' => '토',  // 목극토
            '토' => '수',  // 토극수
            '수' => '화',  // 수극화
            '화' => '금',  // 화극금
            '금' => '목'   // 금극목
        ];

        return isset($controllingMap[$elementA]) && $controllingMap[$elementA] === $elementB;
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
