/**
 * Silver AI - Laravel Backend Gateway Service
 */

const API_BASE_URL = 'http://localhost:8000/api';

export interface ChatResponse {
    answer: string;
    thread: any;
}

export async function* streamMessage(
    prompt: string,
    systemInstruction: string,
    maxTokens: number = 10000,
    threadId?: string,
    appId?: string
): AsyncGenerator<string, void, unknown> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                thread_id: threadId || Date.now().toString(),
                app_id: appId,
                // These could be dynamic based on the active app/persona
                industry: 'silver_marketing',
                persona: 'marketing_strategist'
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Backend API error');
        }

        const data: ChatResponse = await response.json();
        const answer = data.answer;

        // Simulate streaming for the UI
        const words = answer.split(' ');
        for (const word of words) {
            yield word + ' ';
            await new Promise(resolve => setTimeout(resolve, 20));
        }

    } catch (error: any) {
        console.error("Backend API Error:", error);
        yield `Error: ${error.message}. Please check if the Laravel backend is running.`;
    }
}

export async function generateImage(prompt: string): Promise<string> {
    // For now, keeping the direct Cloudflare call or implement it in Laravel
    // Since Laravel doesn't have image gen yet, let's keep it direct or mock it.
    // Given the task is conversion, I should probably implement it in Laravel soon.
    return "https://via.placeholder.com/512?text=Image+Generation+Coming+Soon";
}

export const resetChatSession = () => {
    // Stateless
};

export async function getThreads() {
    const response = await fetch(`${API_BASE_URL}/chat/threads`);
    return await response.json();
}

export async function getThreadMessages(threadId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/threads/${threadId}`);
    return await response.json();
}

export async function deleteThread(threadId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/threads/${threadId}`, {
        method: 'DELETE'
    });
    return await response.json();
}
