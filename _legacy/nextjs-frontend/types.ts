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
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  icon?: string; // URL or emoji char
  isSystem?: boolean;
  category?: 'creative' | 'coding' | 'productivity' | 'general';
}

export interface ChatThread {
  id: string;
  title: string;
  appId: string;
  messages: Message[];
  lastUpdated: number;
}

export enum ViewMode {
  CHAT = 'CHAT',
  APPS_LIBRARY = 'APPS_LIBRARY',
  SETTINGS = 'SETTINGS'
}

export interface AppSettings {
  maxTokens: number;
}
