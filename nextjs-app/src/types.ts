export enum Sender {
    USER = 'user',
    MODEL = 'model'
}

export interface Message {
    id: string;
    sender: Sender;
    text: string;
    imageUrl?: string;
    isStreaming?: boolean;
    timestamp: number;
}

export interface AppDefinition {
    id: string | number;
    name: string;
    description: string;
    systemInstruction: string;
    icon?: string;
    isSystem?: boolean;
    isGlobal?: boolean;
    isPublic?: boolean;
    category?: string;
    roles?: any[];
}

export interface ChatThread {
    id: string;
    title: string;
    appId: string;
    messages: Message[];
    lastUpdated: number;
    folderId?: number | null;
}

export interface Folder {
    id: number;
    name: string;
    color?: string;
    threads?: ChatThread[];
}

export interface Prompt {
    id: number;
    title: string;
    content: string;
    category?: string;
}

export enum ViewMode {
    CHAT = 'CHAT',
    APPS_LIBRARY = 'APPS_LIBRARY',
    SETTINGS = 'SETTINGS',
    PROFILE = 'PROFILE'
}

export interface AppSettings {
    maxTokens: number;
    businessName: string;
    industry: string;
    globalContext: string;
    userRole: string;
}
