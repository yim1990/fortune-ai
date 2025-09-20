<?php

// Composer autoload
require_once __DIR__ . '/../vendor/autoload.php';

// 환경 변수 로드
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// 타임존 설정
date_default_timezone_set($_ENV['TIMEZONE'] ?? 'Asia/Seoul');

// 에러 리포팅 설정
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
ini_set('display_errors', $_ENV['APP_DEBUG'] === 'true' ? '1' : '0');

// CORS 헤더 설정
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// OPTIONS 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 라우팅
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// 헬스체크 엔드포인트
if ($requestMethod === 'GET' && strpos($requestUri, '/healthz') !== false) {
    echo 'ok';
    exit;
}

// API 변환 엔드포인트
if ($requestMethod === 'POST' && strpos($requestUri, '/api/convert') !== false) {
    try {
        // JSON 입력 파싱
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'code' => 'INVALID_JSON',
                'message' => '유효하지 않은 JSON 형식입니다.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 필수 필드 검증
        $requiredFields = ['calendar', 'date', 'time', 'gender', 'name', 'phone'];
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'code' => 'MISSING_FIELD',
                    'message' => "필수 필드가 누락되었습니다: {$field}"
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }

        // 날짜 형식 검증
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['date'])) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'code' => 'INVALID_DATE',
                'message' => '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식을 사용하세요.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 시간 형식 검증
        if (!preg_match('/^\d{2}:\d{2}$/', $input['time'])) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'code' => 'INVALID_TIME',
                'message' => '시간 형식이 올바르지 않습니다. HH:MM 형식을 사용하세요.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 성별 검증
        if (!in_array($input['gender'], ['male', 'female'])) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'code' => 'INVALID_GENDER',
                'message' => '성별은 male 또는 female이어야 합니다.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // 달력 타입 검증
        if (!in_array($input['calendar'], ['solar', 'lunar'])) {
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'code' => 'INVALID_CALENDAR',
                'message' => '달력 타입은 solar 또는 lunar이어야 합니다.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // LunarConverter를 사용한 실제 만세력 변환 (환경 변수에서 API 키 자동 로드)
        $lunarConverter = new \FortuneAI\LunarConverter();
        $result = $lunarConverter->convert($input);

        echo json_encode([
            'ok' => true,
            'data' => $result
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        error_log('API Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'code' => 'INTERNAL_ERROR',
            'message' => '서버 내부 오류가 발생했습니다.'
        ], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// 404 응답
http_response_code(404);
echo json_encode([
    'ok' => false,
    'code' => 'NOT_FOUND',
    'message' => '요청한 엔드포인트를 찾을 수 없습니다.'
], JSON_UNESCAPED_UNICODE);