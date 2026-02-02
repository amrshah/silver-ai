<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SilverAIService
{
    protected $accountId;
    protected $gatewayId;
    protected $apiToken;
    protected $activeIndustry;
    protected $activePersona;
    protected $config;

    public function __construct()
    {
        $this->accountId = config('silverai.account_id');
        $this->gatewayId = config('silverai.gateway_id');
        $this->apiToken = config('silverai.api_token');
        
        // Load default config from a json or just define it
        $this->config = [
            'industries' => [
                'silver_marketing' => [
                    'global_context' => "You are an advanced AI assistant for Silver Ant Marketing, a full-service digital marketing agency. You help structure marketing strategies, manage improved workflows for SEO, PPC, and SMM, and interact with the developing Stratos Agency OS.",
                    'personas' => [
                        'marketing_strategist' => [
                            'model' => '@cf/meta/llama-3.1-8b-instruct',
                            'instruction' => "Provide professional digital marketing advice, campaign ideas, and strategic insights.",
                            'temp' => 0.5
                        ]
                    ]
                ]
            ]
        ];
    }

    public function setIndustry(string $industryKey): self
    {
        $this->activeIndustry = $this->config['industries'][$industryKey] ?? null;
        return $this;
    }

    public function setPersona(string $personaKey): self
    {
        if (!$this->activeIndustry || !isset($this->activeIndustry['personas'][$personaKey])) {
            return $this;
        }
        $this->activePersona = $this->activeIndustry['personas'][$personaKey];
        return $this;
    }

    public function ask(string $prompt, array $history = [], int $maxTokens = 2048, ?string $systemInstruction = null): string
    {
        $model = $this->activePersona['model'] ?? '@cf/meta/llama-3.1-8b-instruct';
        
        $url = "https://gateway.ai.cloudflare.com/v1/{$this->accountId}/{$this->gatewayId}/workers-ai/run/{$model}";

        $baseInstruction = $systemInstruction ?? ($this->activePersona['instruction'] ?? "You are a helpful assistant.");
        $messages = [
            ['role' => 'system', 'content' => $this->activeIndustry['global_context'] . " " . $baseInstruction]
        ];

        // Add history
        foreach ($history as $msg) {
            $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
        }

        // Add current prompt
        $messages[] = ['role' => 'user', 'content' => $prompt];

        try {
            $response = Http::withoutVerifying()->withHeaders([
                'cf-aig-authorization' => 'Bearer ' . $this->apiToken
            ])->post($url, [
                'messages' => $messages,
                'max_tokens' => $maxTokens
            ]);

            if ($response->failed()) {
                Log::error('SilverAI API Error', ['status' => $response->status(), 'body' => $response->body()]);
                return "AI Error: " . $response->status();
            }

            $data = $response->json();

            if (isset($data['result']['response'])) {
                return $data['result']['response'];
            } elseif (isset($data['response'])) {
                return $data['response'];
            } elseif (isset($data['result'])) {
                return is_string($data['result']) ? $data['result'] : json_encode($data['result']);
            }

            return "Connected to Hub, but the brain gave a blank look.";

        } catch (\Exception $e) {
            Log::error('SilverAI Exception', ['message' => $e->getMessage()]);
            return "System Error: " . $e->getMessage();
        }
    }
}
