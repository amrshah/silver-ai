import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AppsLibrary from './components/AppsLibrary';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import { ViewMode, AppDefinition, Message, ChatThread, AppSettings } from './types';
import { SYSTEM_APPS, MOCK_USER_APPS } from './constants';
import { resetChatSession } from './services/aiGatewayService';
import { Menu } from 'lucide-react';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.APPS_LIBRARY);
  const [userApps, setUserApps] = useState<AppDefinition[]>(MOCK_USER_APPS);
  const [activeApp, setActiveApp] = useState<AppDefinition>(SYSTEM_APPS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('alamia_settings');
    return saved ? JSON.parse(saved) : { maxTokens: 2048 };
  });

  useEffect(() => {
    localStorage.setItem('alamia_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle responsive sidebar initial state
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

  // Sync current messages to the threads list
  useEffect(() => {
    if (currentThreadId && messages.length > 0) {
      setThreads(prev => prev.map(t => {
        if (t.id === currentThreadId) {
          // Update title from first message if it's still 'New Chat'
          let newTitle = t.title;
          if (t.title === 'New Chat' && messages.length > 0) {
            newTitle = messages[0].text.substring(0, 40) + (messages[0].text.length > 40 ? '...' : '');
          }
          return { ...t, messages, lastUpdated: Date.now(), title: newTitle };
        }
        return t;
      }));
    }
  }, [messages, currentThreadId]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const createNewThread = (app: AppDefinition) => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: 'New Chat',
      appId: app.id,
      messages: [],
      lastUpdated: Date.now()
    };
    setThreads([newThread, ...threads]);
    setCurrentThreadId(newThread.id);
    setMessages([]);
    setActiveApp(app);
    resetChatSession();
  };

  const handleAppSelect = (app: AppDefinition) => {
    createNewThread(app);
    setViewMode(ViewMode.CHAT);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleThreadSelect = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      const app = SYSTEM_APPS.find(a => a.id === thread.appId) || userApps.find(a => a.id === thread.appId) || SYSTEM_APPS[0];
      setCurrentThreadId(threadId);
      setMessages(thread.messages);
      setActiveApp(app);
      setViewMode(ViewMode.CHAT);
      resetChatSession();
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (currentThreadId === threadId) {
      setCurrentThreadId(null);
      setMessages([]);
      setViewMode(ViewMode.APPS_LIBRARY);
    }
  };

  const handleAppCreate = (newApp: AppDefinition) => {
    setUserApps([...userApps, newApp]);
  };

  const handleNewChat = () => {
    createNewThread(activeApp);
    setViewMode(ViewMode.CHAT);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleNavigate = (view: ViewMode) => {
    setViewMode(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.APPS_LIBRARY:
        return (
          <AppsLibrary
            systemApps={SYSTEM_APPS}
            userApps={userApps}
            onAppSelect={handleAppSelect}
            onAppCreate={handleAppCreate}
          />
        );
      case ViewMode.CHAT:
        return (
          <ChatInterface
            activeApp={activeApp}
            messages={messages}
            setMessages={setMessages}
            settings={settings}
            threadId={currentThreadId}
          />
        );
      case ViewMode.SETTINGS:
        return <Settings settings={settings} onSettingsChange={setSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden text-gray-200 font-sans">
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-40 p-2 rounded-lg bg-gray-800 text-white md:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
      >
        <Menu size={20} />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentView={viewMode}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
        threads={threads}
        currentThreadId={currentThreadId}
        onThreadSelect={handleThreadSelect}
        onDeleteThread={handleDeleteThread}
      />

      <main
        className={`
          flex-1 h-full transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
        `}
      >
        {renderContent()}
      </main>
    </div>
  );
}

export default App;