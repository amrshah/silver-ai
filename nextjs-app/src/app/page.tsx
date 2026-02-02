"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import AntsHub from '@/components/AntsHub';
import ChatInterface from '@/components/ChatInterface';
import Settings from '@/components/Settings';
import Login from '@/components/Login';
import { useRouter, useSearchParams } from 'next/navigation';
import { ViewMode, AntDefinition, Message, ChatThread, AppSettings, Folder } from '@/types';
import { SYSTEM_ANTS, MOCK_USER_ANTS } from '@/constants';
import {
  resetChatSession,
  getThreads,
  deleteThread as deleteThreadFromApi,
  getCurrentUser,
  logout as logoutFromApi,
  getFolders,
  createFolder as createFolderApi,
  deleteFolder as deleteFolderApi,
  renameThread as renameThreadApi,
  moveThread as moveThreadApi,
  getAnts,
  createAnt as createAntApi
} from '@/services/aiGatewayService';
import { Menu } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Initial state from URL
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return ViewMode.CHAT;
    const mode = searchParams.get('view') as ViewMode;
    return Object.values(ViewMode).includes(mode) ? mode : ViewMode.CHAT;
  });

  const [userAnts, setUserAnts] = useState<AntDefinition[]>([]);
  const [systemAnts, setSystemAnts] = useState<AntDefinition[]>([]);
  const [activeAntId, setActiveAntId] = useState<string | number>(() => {
    return searchParams.get('ant') || SYSTEM_ANTS[0].id;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentThreadId, setCurrentThreadIdState] = useState<string | null>(() => {
    return searchParams.get('thread');
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    const params = new URLSearchParams(window.location.search);
    params.set('view', mode);
    router.push(`?${params.toString()}`);
  };

  const setCurrentThreadId = (id: string | null) => {
    setCurrentThreadIdState(id);
    const params = new URLSearchParams(window.location.search);
    if (id) params.set('thread', id);
    else params.delete('thread');
    router.push(`?${params.toString()}`);
  };

  const setActiveAnt = (ant: AntDefinition) => {
    setActiveAntId(ant.id);
    const params = new URLSearchParams(window.location.search);
    params.set('ant', ant.id.toString());
    router.push(`?${params.toString()}`);
  };

  const activeAnt = [...systemAnts, ...userAnts].find(a => a.id.toString() === activeAntId.toString()) || systemAnts[0] || SYSTEM_ANTS[0];

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
      maxTokens: 2048,
      businessName: '',
      industry: 'General',
      globalContext: '',
      userRole: 'General Executive'
    };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('silver_ai_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    return defaultSettings;
  });

  // Sync state with URL changes (back/forward button)
  useEffect(() => {
    const mode = searchParams.get('view') as ViewMode;
    if (mode && Object.values(ViewMode).includes(mode) && mode !== viewMode) {
      setViewModeState(mode);
    }

    const thread = searchParams.get('thread');
    if (thread !== currentThreadId) {
      setCurrentThreadIdState(thread);
    }

    const ant = searchParams.get('ant');
    if (ant && ant !== activeAntId.toString()) {
      setActiveAntId(ant);
    }
  }, [searchParams]);

  const fetchAnts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getAnts();
      setSystemAnts(data.filter((a: AntDefinition) => a.isSystem || a.isGlobal));
      setUserAnts(data.filter((a: AntDefinition) => !a.isSystem && !a.isGlobal));
    } catch (error) {
      console.error("Failed to fetch ants:", error);
    }
  }, [isAuthenticated]);

  const fetchThreads = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getThreads();
      const formattedThreads: ChatThread[] = data.map((t: any) => ({
        id: t.id,
        title: t.title || 'Untitled Session',
        antId: t.ant_id || 'default-assistant',
        folderId: t.folder_id,
        messages: [],
        lastUpdated: new Date(t.updated_at).getTime()
      }));
      setThreads(formattedThreads);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    }
  }, [isAuthenticated]);

  const fetchFolders = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  }, [isAuthenticated]);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            setSettings(prev => ({ ...prev, userRole: userData.role || 'General Executive' }));
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('silver_ai_settings', JSON.stringify(settings));
    }
  }, [settings, isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchThreads();
      fetchFolders();
      fetchAnts();
    }
  }, [isAuthenticated, fetchThreads, fetchFolders, fetchAnts]);

  // Load messages when thread ID changes (e.g., via URL navigation)
  useEffect(() => {
    const loadThreadMessages = async () => {
      if (currentThreadId && isAuthenticated) {
        // Only load if current messages don't match or are empty
        // Actually, always reload for now to stay in sync with the thread
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
          const data = await fetch(`${apiBaseUrl}/chat/threads/${currentThreadId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              'Accept': 'application/json'
            }
          }).then(res => res.json());

          const formattedMessages: Message[] = data.messages.map((m: any) => ({
            id: m.id.toString(),
            sender: m.role === 'user' ? 'user' : 'model',
            text: m.content,
            timestamp: new Date(m.created_at).getTime()
          }));
          setMessages(formattedMessages);

          // Also sync active ant if needed
          const thread = threads.find(t => t.id === currentThreadId);
          if (thread) {
            const ant = [...systemAnts, ...userAnts].find(a => a.id.toString() === thread.antId.toString()) || systemAnts[0];
            if (ant && ant.id !== activeAntId) {
              setActiveAntId(ant.id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch thread messages:", error);
        }
      }
    };
    loadThreadMessages();
  }, [currentThreadId, isAuthenticated, threads, systemAnts, userAnts]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logoutFromApi();
    setIsAuthenticated(false);
    setUser(null);
    setThreads([]);
    setFolders([]);
    setCurrentThreadId(null);
    setMessages([]);
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const createNewThread = (ant: AntDefinition) => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: 'New Chat',
      antId: ant.id.toString(),
      messages: [],
      lastUpdated: Date.now()
    };
    setThreads([newThread, ...threads]);
    setCurrentThreadId(newThread.id);
    setMessages([]);
    setActiveAnt(ant);
    resetChatSession();
  };

  const handleAntSelect = (ant: AntDefinition) => {
    createNewThread(ant);
    setViewMode(ViewMode.CHAT);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleThreadSelect = async (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      const ant = systemAnts.find(a => a.id === thread.antId) || userAnts.find(a => a.id === thread.antId) || systemAnts[0];
      setCurrentThreadId(threadId);

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const data = await fetch(`${apiBaseUrl}/chat/threads/${threadId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Accept': 'application/json'
          }
        }).then(res => res.json());

        const formattedMessages: Message[] = data.messages.map((m: any) => ({
          id: m.id.toString(),
          sender: m.role === 'user' ? 'user' : 'model',
          text: m.content,
          timestamp: new Date(m.created_at).getTime()
        }));
        setMessages(formattedMessages);
      } catch (error) {
        setMessages([]);
      }

      setActiveAnt(ant);
      setViewMode(ViewMode.CHAT);
      resetChatSession();
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await deleteThreadFromApi(threadId);
      setThreads(prev => prev.filter(t => t.id !== threadId));
      if (currentThreadId === threadId) {
        setCurrentThreadId(null);
        setMessages([]);
        setViewMode(ViewMode.ANTS_HUB);
      }
    } catch (error) {
      console.error("Failed to delete thread:", error);
    }
  };

  const handleRenameThread = async (threadId: string, title: string) => {
    try {
      await renameThreadApi(threadId, title);
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, title } : t));
    } catch (error) {
      console.error("Failed to rename thread:", error);
    }
  };

  const handleMoveThread = async (threadId: string, folderId: number | null) => {
    try {
      await moveThreadApi(threadId, folderId);
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, folderId } : t));
    } catch (error) {
      console.error("Failed to move thread:", error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const newFolder = await createFolderApi(name);
      setFolders(prev => [...prev, newFolder]);
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await deleteFolderApi(folderId);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      // Reset folderId for threads in that folder
      setThreads(prev => prev.map(t => t.folderId === folderId ? { ...t, folderId: null } : t));
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  const handleThreadUpdate = useCallback((update: any) => {
    if (update.provisioned) {
      fetchAnts();
    }
    if (update.forceRefresh) {
      fetchThreads();
    }
  }, [fetchThreads, fetchAnts]);

  const handleAntCreate = async (antData: AntDefinition) => {
    try {
      const newAnt = await createAntApi({
        name: antData.name,
        description: antData.description,
        system_instruction: antData.systemInstruction,
        icon: antData.icon,
        category: antData.category || 'general',
        is_public: antData.isPublic || false,
        is_system: antData.isSystem || false,
        is_global: antData.isGlobal || false
      });
      setUserAnts(prev => [...prev, newAnt]);
    } catch (error) {
      console.error("Failed to create ant:", error);
    }
  };

  const handleNewChat = () => {
    createNewThread(activeAnt);
    setViewMode(ViewMode.CHAT);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.ANTS_HUB:
        return (
          <AntsHub
            systemAnts={systemAnts}
            userAnts={userAnts}
            onAntSelect={handleAntSelect}
            onAntCreate={handleAntCreate}
            isAdmin={!!user?.is_admin}
          />
        );
      case ViewMode.CHAT:
        return (
          <ChatInterface
            activeAnt={activeAnt}
            messages={messages}
            setMessages={setMessages}
            settings={settings}
            threadId={currentThreadId}
            onThreadUpdate={handleThreadUpdate}
          />
        );
      case ViewMode.SETTINGS:
        return <Settings settings={settings} onSettingsChange={setSettings} user={user} />;
      default:
        return null;
    }
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#c4c4c4]/60 font-bold tracking-[0.3em] uppercase text-[10px]">Initializing Elara...</p>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#0f0f0f] overflow-hidden text-gray-200 font-sans">
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/5 text-white md:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
      >
        <Menu size={20} />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        onNavigate={setViewMode}
        currentView={viewMode}
        onNewChat={handleNewChat}
        threads={threads}
        folders={folders}
        currentThreadId={currentThreadId}
        onThreadSelect={handleThreadSelect}
        onDeleteThread={handleDeleteThread}
        onRenameThread={handleRenameThread}
        onMoveThread={handleMoveThread}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onLogout={handleLogout}
        user={user}
      />

      <main
        className={`
          flex-1 h-full transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? 'md:ml-72' : 'ml-0'}
        `}
      >
        {renderContent()}
      </main>
    </div>
  );
}
