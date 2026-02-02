import React from 'react';
import { LayoutGrid, MessageSquarePlus, Settings, LogOut, ChevronLeft, ChevronRight, MessageSquare, Trash2 } from 'lucide-react';
import { ViewMode, ChatThread } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onNavigate: (view: ViewMode) => void;
  currentView: ViewMode;
  onNewChat: () => void;
  threads: ChatThread[];
  currentThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  onNavigate,
  currentView,
  onNewChat,
  threads,
  currentThreadId,
  onThreadSelect,
  onDeleteThread
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col bg-black md:bg-gray-950 border-r border-gray-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Silver AI
          </h1>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400">
            <ChevronLeft />
          </button>
        </div>

        <div className="px-3 py-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors text-sm font-medium border border-gray-700 hover:border-gray-600 shadow-lg"
          >
            <MessageSquarePlus size={18} className="text-blue-400" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 py-2 mt-4 mb-2">
            Navigation
          </div>

          <button
            onClick={() => onNavigate(ViewMode.APPS_LIBRARY)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${currentView === ViewMode.APPS_LIBRARY ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-gray-950 hover:text-gray-200'}`}
          >
            <LayoutGrid size={18} />
            Explore Apps
          </button>

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 py-2 mt-8 mb-2">
            Recent Chats
          </div>

          <div className="space-y-1">
            {threads.length === 0 ? (
              <div className="px-4 py-2 text-xs text-gray-600 italic font-medium">
                No recent chats
              </div>
            ) : (
              threads.map(thread => (
                <div
                  key={thread.id}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all group ${currentThreadId === thread.id && currentView === ViewMode.CHAT ? 'bg-gray-900 text-blue-400' : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'}`}
                >
                  <button
                    onClick={() => onThreadSelect(thread.id)}
                    className="flex-1 flex items-center gap-3 truncate text-left"
                  >
                    <MessageSquare size={16} className={currentThreadId === thread.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'} />
                    <span className="truncate">{thread.title}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteThread(thread.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-900 bg-gray-950/50">
          <button
            onClick={() => onNavigate(ViewMode.SETTINGS)}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-all ${currentView === ViewMode.SETTINGS ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}
          >
            <Settings size={18} />
            Settings
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-2.5 mt-2 text-sm text-gray-500 hover:text-red-400 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Toggle Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-30 p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white md:block hidden border border-gray-700"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;