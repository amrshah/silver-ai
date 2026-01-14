<?php

class SilverAI {
    private $config;
    private $activeIndustry;
    private $activePersona;

    public function __construct(string $configPath = 'silver_config.json') {
        $data = file_get_contents($configPath);
        $this->config = json_decode($data, true);
    }

    public function setIndustry(string $industryKey): self {
        $this->activeIndustry = $this->config['industries'][$industryKey] ?? null;
        return $this;
    }

    public function setPersona(string $personaKey): bool {
        if (!$this->activeIndustry || !isset($this->activeIndustry['personas'][$personaKey])) {
            return false;
        }
        $this->activePersona = $this->activeIndustry['personas'][$personaKey];
        return true;
    }

    public function ask(string $prompt): string {
    $settings = $this->config['settings'];
    $model = $this->activePersona['model'] ?? '@cf/meta/llama-3.1-8b-instruct';
    
    // NATIVE URL: Points directly to the model through the gateway
    // Structure: .../gateway_id/workers-ai/run/model_name
    $url = "https://gateway.ai.cloudflare.com/v1/{$settings['account_id']}/{$settings['gateway_id']}/workers-ai/run/{$model}";

    $payload = [
        'messages' => [
            ['role' => 'system', 'content' => $this->activeIndustry['global_context'] . " " . $this->activePersona['instruction']],
            ['role' => 'user', 'content' => $prompt]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'cf-aig-authorization: Bearer ' . $settings['api_token'] 
        ],
        CURLOPT_TIMEOUT => 60,
        CURLOPT_SSL_VERIFYPEER => false 
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $data = json_decode($response, true);
    $curlError = curl_error($ch);
    curl_close($ch);

    // Debug Logging
    file_put_contents('silver_debug.log', date('Y-m-d H:i:s') . " - Code: $httpCode - Response: " . substr($response, 0, 500) . "\n", FILE_APPEND);

    if ($curlError) {
        return "System Error (Curl): " . $curlError;
    }

    // 1. Check for errors
    if (isset($data['success']) && $data['success'] === false) {
        return "CF Error: " . ($data['errors'][0]['message'] ?? 'Unknown Error') . " (Code: {$data['errors'][0]['code']})";
    }

    // 2. Flexible response parsing
    if (isset($data['result']['response'])) {
        return $data['result']['response'];
    } elseif (isset($data['response'])) {
        return $data['response'];
    } elseif (isset($data['result'])) {
        return is_string($data['result']) ? $data['result'] : json_encode($data['result']);
    }

    return "Connected to Hub, but the brain gave a blank look. (Check your system prompt).";
}
}
