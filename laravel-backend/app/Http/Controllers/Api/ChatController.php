<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Thread;
use App\Models\Folder;
use App\Models\Prompt;
use App\Services\SilverAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    protected $aiService;

    public function __construct(SilverAIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function index(Request $request)
    {
        return $request->user()->threads()->orderBy('updated_at', 'desc')->get();
    }

    public function show(Request $request, string $id)
    {
        $thread = $request->user()->threads()->with('messages')->findOrFail($id);
        return $thread;
    }

    public function store(Request $request)
    {
        $request->validate([
            'prompt' => 'required|string',
            'thread_id' => 'required|string',
            'ant_id' => 'nullable|string',
            'industry' => 'nullable|string',
            'persona' => 'nullable|string',
            'system_instruction' => 'nullable|string',
            'max_tokens' => 'nullable|integer',
        ]);

        $user = $request->user();
        $threadId = $request->thread_id;
        $prompt = $request->prompt;
        
        // Find or create thread
        $isNewThread = !Thread::where('id', $threadId)->exists();
        $thread = Thread::firstOrCreate(
            ['id' => $threadId],
            [
                'user_id' => $user->id,
                'title' => 'New Chat',
                'ant_id' => $request->ant_id ?? 'default'
            ]
        );

        // Security check
        if ($thread->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Store user message
        $thread->messages()->create([
            'role' => 'user',
            'content' => $prompt
        ]);

        // Get history
        $history = $thread->messages()
            ->orderBy('created_at', 'asc')
            ->get(['role', 'content'])
            ->toArray();

        // Fetch available ants for context to help AI recommend
        $role = $user->role;
        $availableAnts = \App\Models\Ant::where(function($query) use ($user, $role) {
            $query->where('is_global', true)
                  ->orWhere('user_id', $user->id)
                  ->orWhere('is_public', true)
                  ->orWhereHas('roles', function($q) use ($role) {
                      $q->where('role_name', $role);
                  });
        })->get(['name', 'description', 'category']);

        // Fetch active ant for self-knowledge
        $activeAnt = null;
        if ($request->ant_id) {
            $activeAnt = \App\Models\Ant::where('id', $request->ant_id)->first();
        }

        $selfKnowledge = "\n\n[SYSTEM_SELF_KNOWLEDGE]\n";
        $selfKnowledge .= "Platform: Silver AI Core (Proprietary Agentic Ecosystem).\n";
        $selfKnowledge .= "Architecture: Specialized Multi-Ant Network.\n";
        if ($activeAnt) {
            $selfKnowledge .= "Your Identity: You are '{$activeAnt->name}', a specialized Ant within Silver AI.\n";
            $selfKnowledge .= "Your Designated Purpose: {$activeAnt->description}\n";
        }
        $selfKnowledge .= "System Awareness: You are contextually aware of being part of a larger platform. You understand that you collaborate with other specialized Ants. If you observe any technical inconsistencies (like a session title mismatch), you are authorized to acknowledge it and state your commitment to maintaining the integrity of the user's workflow.\n";

        $antContext = "\n\n[DETERMINISTIC CONTEXT]\nThe user's role is: {$role}. Available ants: " . $availableAnts->toJson() . ".\n";
        $antContext .= "If the user asks for recommendations, suggest both existing and NEW specialized ants.\n";
        $antContext .= "CRITICAL: If the user says 'okay create them' or similar, respond with exactly [CREATE_ANT] followed by a JSON object for each ant: {\"name\": \"...\", \"description\": \"...\", \"icon\": \"...\", \"system_instruction\": \"...\", \"category\": \"...\"}.";

        $domainEnforcement = "\n\nCRITICAL DOMAIN ENFORCEMENT:\n";
        $domainEnforcement .= "You are a specialized intelligence ant. You MUST stay strictly within your designated expertise. Do NOT be multi-purpose.\n";
        $domainEnforcement .= "- If asked for something outside your domain (e.g., Marketing ant asked for Code, or Coder asked for Marketing), you MUST decline. Say: 'I am specialized strictly in [Domain]. For [Task], please use one of our [Relevant Category] ants.'\n";
        $domainEnforcement .= "- NEVER provide even 'basic' help for out-of-domain tasks. Partial help is a violation of protocol.\n";

        $combinedSystemInstruction = ($request->system_instruction ?? "You are a helpful assistant.") . $selfKnowledge . $antContext . $domainEnforcement;

        // Call AI
        $this->aiService->setIndustry($request->industry ?? 'silver_marketing')
                       ->setPersona($request->persona ?? 'marketing_strategist');
        
        $answer = $this->aiService->ask(
            $prompt, 
            array_slice($history, 0, -1),
            $request->max_tokens ?? 2048,
            $combinedSystemInstruction
        );

        // Detect [CREATE_ANT] in response and provision them
        $provisioned = false;
        if (str_contains($answer, '[CREATE_ANT]')) {
            $parts = explode('[CREATE_ANT]', $answer);
            foreach (array_slice($parts, 1) as $part) {
                // Parse JSON
                if (preg_match('/\{.*\}/s', $part, $matches)) {
                    $spec = json_decode($matches[0], true);
                    if ($spec && isset($spec['name'])) {
                        \App\Models\Ant::create([
                            'user_id' => $user->id,
                            'name' => $spec['name'],
                            'description' => $spec['description'] ?? '',
                            'icon' => $spec['icon'] ?? 'Sparkles',
                            'system_instruction' => $spec['system_instruction'] ?? 'Strategic assistant.',
                            'category' => $spec['category'] ?? 'General',
                            'is_public' => false
                        ]);
                        $provisioned = true;
                    }
                }
            }
            // Clean up the technical tag for the final user display
            $answer = preg_replace('/\[CREATE_ANT\].*?(\{.*?\})/s', '*(Provisioned: Ant created successfully!)*', $answer);
        }

        // Store AI message
        $thread->messages()->create([
            'role' => 'assistant',
            'content' => $answer
        ]);

        // Auto-rename thread if it's the first message
        if ($isNewThread || $thread->title === 'New Chat') {
            $titlePrompt = "Create a very concise (max 4 words) title for a chat that starts with this message: \"{$prompt}\". Return ONLY the title text.";
            $newTitle = $this->aiService->ask($titlePrompt, [], 100);
            $thread->update(['title' => trim($newTitle, '" ') ?: 'New Chat']);
        }

        $thread->touch();

        return response()->json([
            'answer' => $answer,
            'thread' => $thread->fresh()->load('messages'),
            'provisioned' => $provisioned
        ]);
    }

    public function renameThread(Request $request, string $id)
    {
        $request->validate(['title' => 'required|string|max:100']);
        $thread = $request->user()->threads()->findOrFail($id);
        $thread->update(['title' => $request->title]);
        return $thread;
    }

    public function destroy(Request $request, string $id)
    {
        $thread = $request->user()->threads()->findOrFail($id);
        $thread->delete();
        return response()->json(['success' => true]);
    }

    // FOLDER METHODS
    public function getFolders(Request $request)
    {
        return $request->user()->folders()->with('threads')->get();
    }

    public function createFolder(Request $request)
    {
        $request->validate(['name' => 'required|string|max:50']);
        return $request->user()->folders()->create($request->only('name', 'color'));
    }

    public function updateFolder(Request $request, Folder $folder)
    {
        if ($folder->user_id !== $request->user()->id) abort(403);
        $request->validate(['name' => 'required|string|max:50']);
        $folder->update($request->only('name', 'color'));
        return $folder;
    }

    public function deleteFolder(Request $request, Folder $folder)
    {
        if ($folder->user_id !== $request->user()->id) abort(403);
        $folder->delete();
        return response()->json(['success' => true]);
    }

    public function moveThread(Request $request, string $threadId)
    {
        $request->validate(['folder_id' => 'nullable|exists:folders,id']);
        $thread = $request->user()->threads()->findOrFail($threadId);
        
        if ($request->folder_id) {
            $folder = Folder::findOrFail($request->folder_id);
            if ($folder->user_id !== $request->user()->id) abort(403);
        }

        $thread->update(['folder_id' => $request->folder_id]);
        return $thread;
    }

    // PROMPT MANAGEMENT
    public function getPrompts(Request $request)
    {
        return $request->user()->prompts()->orderBy('created_at', 'desc')->get();
    }

    public function createPrompt(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'category' => 'nullable|string|max:50'
        ]);

        return $request->user()->prompts()->create($request->only('title', 'content', 'category'));
    }

    public function deletePrompt(Request $request, Prompt $prompt)
    {
        if ($prompt->user_id !== $request->user()->id) abort(403);
        $prompt->delete();
        return response()->json(['success' => true]);
    }

    public function updatePrompt(Request $request, Prompt $prompt)
    {
        if ($prompt->user_id !== $request->user()->id) abort(403);
        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'category' => 'nullable|string|max:50'
        ]);

        $prompt->update($request->only('title', 'content', 'category'));
        return $prompt;
    }
}
