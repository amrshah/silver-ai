<?php
// 1. Force the response to be JSON even if an error occurs
header('Content-Type: application/json');
require_once '../SilverAI.php';

try {
    // 1. Get Input
    $input = json_decode(file_get_contents('php://input'), true);
    $prompt = $input['prompt'] ?? '';

    if (empty($prompt)) {
        echo json_encode(['answer' => 'Please say something.']);
        exit;
    }

    // 2. Initialize Silver AI
    // Note: Config path is relative to SilverAI.php's execution context or we pass absolute
    $ai = new SilverAI('../silver_config.json');
    $ai->setIndustry('silver_marketing')->setPersona('marketing_strategist');

    $answer = $ai->ask($prompt);

    echo json_encode(['answer' => $answer]);

} catch (Exception $e) {
    // Return the actual error as a JSON string so your UI doesn't break
    echo json_encode(['answer' => 'System Error: ' . $e->getMessage()]);
}
