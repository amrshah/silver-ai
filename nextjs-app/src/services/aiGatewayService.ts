/**
 * Silver AI - Laravel Backend Gateway Service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

import { AppDefinition } from '../types';

const mapApplet = (app: any): AppDefinition => ({
    id: app.id,
    name: app.name,
    description: app.description,
    systemInstruction: app.system_instruction || app.systemInstruction,
    icon: app.icon,
    isSystem: !!app.is_system,
    isGlobal: !!app.is_global,
    isPublic: !!app.is_public,
    category: app.category,
    roles: app.roles
});

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export interface ChatResponse {
    answer: string;
    thread: any;
    provisioned?: boolean;
}

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('auth_token', data.access_token);
    }
    return data;
}

export async function logout() {
    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: getHeaders()
        });
    } catch (err) {
        console.error("Logout error:", err);
    } finally {
        localStorage.removeItem('auth_token');
    }
}

export async function getApplets(): Promise<AppDefinition[]> {
    const response = await fetch(`${API_BASE_URL}/applets`, {
        headers: getHeaders()
    });
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapApplet) : [];
}

export async function adminGetApplets(): Promise<AppDefinition[]> {
    const response = await fetch(`${API_BASE_URL}/admin/applets`, {
        headers: getHeaders()
    });
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapApplet) : [];
}

export async function createApplet(data: any): Promise<AppDefinition> {
    const response = await fetch(`${API_BASE_URL}/applets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return mapApplet(result);
}

export async function updateApplet(id: number | string, data: any): Promise<AppDefinition> {
    const response = await fetch(`${API_BASE_URL}/applets/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return mapApplet(result);
}

export async function deleteApplet(id: number) {
    const response = await fetch(`${API_BASE_URL}/applets/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await response.json();
}

export async function* streamMessage(
    prompt: string,
    systemInstruction: string,
    maxTokens: number = 10000,
    threadId?: string,
    appId?: string
): AsyncGenerator<string, { thread: any, provisioned: boolean }, unknown> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat/ask`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                prompt,
                system_instruction: systemInstruction,
                max_tokens: maxTokens,
                thread_id: threadId || Date.now().toString(),
                app_id: appId,
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

        const words = answer.split(' ');
        for (const word of words) {
            yield word + ' ';
            await new Promise(resolve => setTimeout(resolve, 20));
        }

        return { thread: data.thread, provisioned: !!data.provisioned };

    } catch (error: any) {
        console.error("Backend API Error:", error);
        yield `Error: ${error.message}. Please check if the Laravel backend is running.`;
        return { thread: null, provisioned: false };
    }
}

export async function renameThread(threadId: string, title: string) {
    const response = await fetch(`${API_BASE_URL}/chat/threads/${threadId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ title })
    });
    return await response.json();
}

export async function generateImage(prompt: string): Promise<string> {
    return "https://via.placeholder.com/512?text=Image+Generation+Coming+Soon";
}

export const resetChatSession = () => {
    // Stateless
};

export async function getThreads() {
    const response = await fetch(`${API_BASE_URL}/chat/threads`, {
        headers: getHeaders()
    });
    return await response.json();
}

export async function getThreadMessages(threadId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/threads/${threadId}`, {
        headers: getHeaders()
    });
    return await response.json();
}

export async function deleteThread(threadId: string) {
    const response = await fetch(`${API_BASE_URL}/chat/threads/${threadId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await response.json();
}

export async function askChat(prompt: string, appId?: string, threadId?: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat/ask`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            prompt,
            thread_id: threadId || `sys-refine-${Date.now()}`,
            app_id: appId,
            max_tokens: 4096,
            industry: 'silver_marketing',
            persona: 'marketing_strategist'
        })
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Backend API error');
    }

    const data: ChatResponse = await response.json();
    return data.answer;
}

export async function getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
        headers: getHeaders()
    });
    if (!response.ok) return null;
    return await response.json();
}

export async function updateProfile(data: { name?: string, role?: string }) {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return await response.json();
}

// FOLDERS
export async function getFolders() {
    const response = await fetch(`${API_BASE_URL}/chat/folders`, {
        headers: getHeaders()
    });
    return await response.json();
}

// PROMPTS
export async function getPrompts() {
    const response = await fetch(`${API_BASE_URL}/prompts`, {
        headers: getHeaders()
    });
    return await response.json();
}

export async function createPrompt(title: string, content: string, category?: string) {
    const response = await fetch(`${API_BASE_URL}/prompts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, content, category })
    });
    return await response.json();
}

export const deletePrompt = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return response.json();
};

export const updatePrompt = async (id: number, data: { title?: string, content?: string, category?: string }) => {
    const response = await fetch(`${API_BASE_URL}/prompts/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return response.json();
};

export async function createFolder(name: string, color?: string) {
    const response = await fetch(`${API_BASE_URL}/chat/folders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, color })
    });
    return await response.json();
}

export async function moveThread(threadId: string, folderId: number | null) {
    const response = await fetch(`${API_BASE_URL}/chat/threads/${threadId}/move`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ folder_id: folderId })
    });
    return await response.json();
}

export async function deleteFolder(folderId: number) {
    const response = await fetch(`${API_BASE_URL}/chat/folders/${folderId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await response.json();
}
