<?php
//레퍼런스: https://pear.oops.org/docs/oops-Lunar/Lunar/Lunar.html#methoddayfortune

set_include_path(get_include_path() . PATH_SEPARATOR . '/opt/homebrew/share/pear');
/*
 * Lunar API import
 */
/*
 * oops/KASI_Lunar pcakge가 설치 되어 있으면, 1391-02-05 ~ 2050-12-31 까지의 음력 데이터를
 * 한국 천문 연구소의 데이터를 이용한다.
 */

error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

require_once 'KASI_Lunar.php';
require_once 'Lunar.php';

if ($argc < 3) {
    echo "사용법: php 파일명 YYYYMMDD HHmm\n";
    exit;
}

$target = $argv[1];// ? $argv[1] : date ('Ymd', time ());
$hour = $argv[2];

$lunar = new oops\Lunar;
$openaiApiKey = $_ENV['OPENAI_API_KEY'] ?? '';

$filename = 'result_' . date('Ymd_His') . '.txt';

function getHourStemBranch($hhmm, $dayStem) {
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

    // Parse hour and minute
    $hour = intval(substr($hhmm, 0, 2));
    $minute = intval(substr($hhmm, 2, 2));

    // Calculate index
    $totalMinutes = $hour * 60 + $minute;
    $branchIndex = intval(($totalMinutes + 60) / 120) % 12;

    $branch = $hourBranches[$branchIndex];

    // 안전성 체크
    if (!isset($hourStemTable[$dayStem])) {
        return (object)[
            'error' => "Invalid day stem: $dayStem"
        ];
    }

    $stem = $hourStemTable[$dayStem][$branchIndex];

    return (object)[
        'korean' => $stem . $branch,
        'chinese' => ($stemMap[$stem] ?? $stem) . ($branchMap[$branch] ?? $branch)
    ];
}

$isPrintedPrompt = false;
$isPrintedPostData = false;

function requestSajuCounseling($yyyymmdd, $yearPillar, $monthPillar, $dayPillar, $hourPillar, $problem) {
    global $openaiApiKey;
    global $isPrintedPrompt;
    global $isPrintedPostData;
    global $filename;

    $url = 'https://api.openai.com/v1/chat/completions';

    $headers = [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $openaiApiKey,
    ];

    $prompt = "생년월일: $yyyymmdd (양력)
성별: 남성
연주: $yearPillar
월주: $monthPillar
일주: $dayPillar
시주: $hourPillar";

    if(! $isPrintedPrompt) {
        print_r($prompt);
        file_put_contents($filename, $prompt."\n\n", FILE_APPEND);
        $isPrintedPrompt = true;
    }

    print_r("\n\nGPT 호출시작\n\n");

    $postData = [ //GPT 추천 설정
        'model' => 'gpt-4o',
        'messages' => [ //https://platform.openai.com/docs/guides/text?api-mode=chat
            ['role' => 'system', 'content' => "사주를 봐주면 좋겠는데 특히 [$problem] 부분을 위주로 설명해주세요. 항목별로 질문을 여러번 할 예정이라 전체적인 사주를 요약해줄 필요는 없습니다. 친절한 여성 카운셀러가 사려깊게 말하는 말투로 최대한 자세하게 풀어주세요. 감성적인 문장으로 써주고 예시를 많이 들어서 문장을 길게 설명해주세요. 처음 시작할 때와 마칠 때 인사 할 필요 없이 본론만 이야기해주세요. 차근차근 단계적으로 생각해서 알려주세요."],
            ['role' => 'user', 'content' => $prompt]
        ],
        //'temperature' => 0.7,
        'top_p' => 1,
        'presence_penalty' => 0,
        'frequency_penalty' => 0,
        'max_completion_tokens' => 2000
    ];

    if(! $isPrintedPostData) {
        print_r($postData);
        file_put_contents($filename, print_r($postData, true)."\n\n", FILE_APPEND);
        $isPrintedPostData = true;
    }


    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    curl_setopt($ch, CURLOPT_POST, true);

    $response = curl_exec($ch);
    curl_close($ch);

    if (!$response) {
        return 'API 호출 실패';
    }

    $result = json_decode($response, true);

    if (isset($result['choices'][0]['message']['content'])) {
        return $result['choices'][0]['message']['content'];
    } else {
        return '응답 파싱 실패: ' . $response;
    }
}

/*
 * $lunar->tolunar ($date)
 *
 * input:
 *        2013-07-16 or
 *        2013-7-16  or
 *        20130716   or
 *        1373900400 or
 *        NULL
 *
 * output
 *        stdClass Object
 *        (
 *            [fmt] => 2013-06-09
 *            [dangi] => 4346
 *            [hyear] => AD 2013
 *            [year] => 2013
 *            [month] => 6
 *            [day] => 9
 *            [leap] =>
 *            [largemonth] => 1
 *            [week] => 화
 *            [hweek] => 火
 *            [unixstamp] => 1373900400
 *            [ganji] => 계사
 *            [hganji] => 癸巳
 *            [gan] => 계
 *            [hgan] => 癸
 *            [ji] => 사
 *            [hji] => 巳
 *            [ddi] => 뱀
 *        )
 */

//print_r ($lunar->tolunar ('2013-07-16'));
//print_r($lunar->tolunar($target));

/*
 * $lunar->dayfortuen ($date)
 *
 * input:
 *        2013-07-16 or
 *        2013-7-16  or
 *        20130716   or
 *        1373900400 or
 *        NULL
 *
 * output:
 *        stdClass Object
 *        (
 *            [data] => stdClass Object
 *                (
 *                     [y] => 29           // 세차 index
 *                     [m] => 55           // 월건 index
 *                     [d] => 19           // 일진 index
 *                )
 *   
 *            [year] => 계사               // 세차 값
 *            [month] => 기미              // 월건 값
 *            [day] => 계미                // 일진 값
 *            [hyear] => 癸巳              // 한자 세차 값
 *            [hmonth] => 己未             // 한자 월건 값
 *            [hday] => 癸未               // 한자 일진 값
 *        )
 */

//print_r ($lunar->dayfortune ('2013-07-16'));
$fortune = $lunar->dayfortune($target);

//print_r($fortune);

$hourStem = getHourStemBranch($argv[2], mb_substr($fortune->day, 0, 1));
//print_r($hourStem);

$problems = [
    //"기본 사주 구성에 대한 설명",
    "오행 분포 분석",
    "연주에 대한 설명",
    "월주에 대한 설명",
    "일간, 일지에 대한 자세한 설명",
    "시주에 대한 설명",
    "전반적인 성격",
    "대운수와 현재의 대운 설명",
    "격국에 대한 설명",
    "용신에 대한 설명",
    "2025년 (을사년) 신년운세",
    "전반적인 직업운과 2025년(을사년) 직업운",
    "전반적인 연애/배우자운과 2025년(을사년) 연애/배우자운",
    "전반적인 재물운과 2025년(을사년) 재물운",
    "전반적인 사업운과 2025년(을사년) 사업운",
    "십성 설명",
    "신살 설명 (주요 신살 7개)",
    "12운성 설명",
    "2025년(을사년)부터 2029년까지의 세운",
    "2025년(을사년)부터 구체적으로 어떤 방향으로 움직어야하는지 조언. 그리고 2025년(을사년) 반드시 시작해야할 것들",
    "2025년(을사년) 총운을 5점 만점에 몇점으로 볼 수 있을까?"
];

foreach($problems as $index => $topic) {
    $result = requestSajuCounseling($argv[1], $fortune->hyear, $fortune->hmonth, $fortune->hday, $hourStem->chinese, $topic);

    print_r($result);
    print_r("\n\n\n");

    file_put_contents($filename, "### ".$topic."\n\n" . $result . "\n\n", FILE_APPEND);
}

/*
 * $lunar->seasondate ($date)
 *
 * input:
 *        2013-07-16 or
 *        2013-7-16  or
 *        20130716   or
 *        1373900400 or
 *        NULL
 *
 * output:
 *        stdClass Object
 *        (
 *            [center] => stdClass Object
 *                (
 *                    [name] => 소서
 *                    [hname] => 小暑
 *                    [hyear] => AD 2013
 *                    [year] => 2013
 *                    [month] => 7
 *                    [day] => 7
 *                    [hour] => 7
 *                    [min] => 49
 *                )
 *  
 *            [ccenter] => stdClass Object
 *                (
 *                    [name] => 대서
 *                    [hname] => 大暑
 *                    [hyear] => AD 2013
 *                    [year] => 2013
 *                    [month] => 7
 *                    [day] => 23
 *                    [hour] => 1
 *                    [min] => 11
 *                )
 *  
 *            [nenter] => stdClass Object
 *                (
 *                    [name] => 입추
 *                    [hname] => 立秋
 *                    [hyear] => AD 2013
 *                    [year] => 2013
 *                    [month] => 8
 *                    [day] => 7
 *                    [hour] => 17
 *                    [min] => 36
 *                )
 *        )
 */

//오류발생
//print_r ($lunar->seasondate('2013-07-16'));

?>