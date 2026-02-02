"use client";

import React, { useState } from 'react';
import {
    LayoutGrid,
    MessageSquarePlus,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Trash2,
    Folder as FolderIcon,
    FolderPlus,
    MoreVertical,
    Edit2,
    FolderEdit,
    MoveRight,
    Search
} from 'lucide-react';
import { ViewMode, ChatThread, Folder } from '../types';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    onNavigate: (view: ViewMode) => void;
    currentView: ViewMode;
    onNewChat: () => void;
    threads: ChatThread[];
    folders: Folder[];
    currentThreadId: string | null;
    onThreadSelect: (threadId: string) => void;
    onDeleteThread: (threadId: string) => void;
    onRenameThread: (threadId: string, newTitle: string) => void;
    onMoveThread: (threadId: string, folderId: number | null) => void;
    onCreateFolder: (name: string) => void;
    onDeleteFolder: (folderId: number) => void;
    onLogout: () => void;
    user: any;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    toggleSidebar,
    onNavigate,
    currentView,
    onNewChat,
    threads,
    folders,
    currentThreadId,
    onThreadSelect,
    onDeleteThread,
    onRenameThread,
    onMoveThread,
    onCreateFolder,
    onDeleteFolder,
    onLogout,
    user
}) => {
    const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleRenameStart = (e: React.MouseEvent, thread: ChatThread) => {
        e.stopPropagation();
        setEditingThreadId(thread.id);
        setEditTitle(thread.title);
    };

    const handleRenameSubmit = (e: React.FormEvent, threadId: string) => {
        e.preventDefault();
        if (editTitle.trim()) {
            onRenameThread(threadId, editTitle.trim());
        }
        setEditingThreadId(null);
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName.trim());
            setNewFolderName("");
            setShowFolderModal(false);
        }
    };

    const filteredThreads = threads.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const unorganizedThreads = filteredThreads.filter(t => !t.folderId);

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
          fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0f0f0f] md:bg-[#0f0f0f] border-r border-gray-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72
        `}
            >
                {/* Branding */}
                <div className="p-6 flex flex-col items-center border-b border-white/5 mb-4 relative">
                    <div className="flex items-center justify-center w-full">
                        <img
                            src="https://silverantmarketing.com/wp-content/uploads/2021/06/header-light-logo-sam.webp"
                            alt="Silver AI Logo"
                            className="h-14 w-auto object-contain cursor-pointer"
                            onClick={() => onNavigate(ViewMode.CHAT)}
                        />
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <ChevronLeft />
                    </button>
                </div>

                {/* Primary Actions */}
                <div className="px-4 py-2 space-y-2">
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white transition-all text-sm font-bold shadow-lg shadow-[#ea580c]/10 group"
                    >
                        <MessageSquarePlus size={18} />
                        New Intelligence Session
                    </button>

                    <button
                        onClick={() => onNavigate(ViewMode.ANTS_HUB)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${currentView === ViewMode.ANTS_HUB ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                    >
                        <LayoutGrid size={18} />
                        Explore Ants
                    </button>
                </div>

                <div className="px-4 mt-6">
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ea580c] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find session..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:bg-white/10 transition-all placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* Main Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
                    {/* Folders Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Projects & Folders</span>
                            <button
                                onClick={() => setShowFolderModal(true)}
                                className="p-1 text-gray-600 hover:text-[#ea580c] transition-colors"
                            >
                                <FolderPlus size={14} />
                            </button>
                        </div>

                        {folders.map(folder => (
                            <div key={folder.id} className="space-y-1">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/5 transition-all group">
                                    <FolderIcon size={14} className="text-[#ea580c]" />
                                    <span className="flex-1 truncate">{folder.name}</span>
                                    <button
                                        onClick={() => onDeleteFolder(folder.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                                <div className="pl-6 border-l border-white/5 ml-4 space-y-1">
                                    {threads.filter(t => t.folderId === folder.id).map(thread => (
                                        <ThreadItem
                                            key={thread.id}
                                            thread={thread}
                                            isActive={currentThreadId === thread.id && currentView === ViewMode.CHAT}
                                            onSelect={onThreadSelect}
                                            onDelete={onDeleteThread}
                                            editingThreadId={editingThreadId}
                                            editTitle={editTitle}
                                            setEditTitle={setEditTitle}
                                            handleRenameStart={handleRenameStart}
                                            handleRenameSubmit={handleRenameSubmit}
                                            folders={folders}
                                            onMove={onMoveThread}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Unorganized History */}
                    <div className="space-y-2">
                        <div className="px-2 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Recent Activity</div>
                        <div className="space-y-1">
                            {unorganizedThreads.length === 0 ? (
                                <p className="px-3 py-2 text-[10px] text-gray-700 italic">No recent unorganized chats</p>
                            ) : (
                                unorganizedThreads.map(thread => (
                                    <ThreadItem
                                        key={thread.id}
                                        thread={thread}
                                        isActive={currentThreadId === thread.id && currentView === ViewMode.CHAT}
                                        onSelect={onThreadSelect}
                                        onDelete={onDeleteThread}
                                        editingThreadId={editingThreadId}
                                        editTitle={editTitle}
                                        setEditTitle={setEditTitle}
                                        handleRenameStart={handleRenameStart}
                                        handleRenameSubmit={handleRenameSubmit}
                                        folders={folders}
                                        onMove={onMoveThread}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile & Settings (The "Executive Center") */}
                <div className="p-4 bg-black/40 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer" onClick={() => onNavigate(ViewMode.SETTINGS)}>
                        <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-white font-extrabold shadow-lg shadow-[#ea580c]/20">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-sm font-extrabold text-white truncate">{user?.name || 'Executive User'}</p>
                            <p className="text-[10px] font-bold text-gray-600 truncate uppercase tracking-tight">Executive Settings</p>
                        </div>
                        <Settings size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 mt-3 text-xs font-bold text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                    >
                        <LogOut size={16} />
                        Logout Session
                    </button>
                </div>
            </div>

            {/* Folder Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-xl font-extrabold text-white mb-4">Create Folder</h3>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Project or group name..."
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 mb-6"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFolderModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="flex-1 px-4 py-3 rounded-xl bg-[#ea580c] text-white font-bold text-sm hover:bg-[#c2410c] transition-all"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

interface ThreadItemProps {
    thread: ChatThread;
    isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    editingThreadId: string | null;
    editTitle: string;
    setEditTitle: (v: string) => void;
    handleRenameStart: (e: React.MouseEvent, thread: ChatThread) => void;
    handleRenameSubmit: (e: React.FormEvent, id: string) => void;
    folders: Folder[];
    onMove: (tid: string, fid: number | null) => void;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
    thread, isActive, onSelect, onDelete, editingThreadId, editTitle,
    setEditTitle, handleRenameStart, handleRenameSubmit, folders, onMove
}) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="relative group">
            <div
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${isActive ? 'bg-white/10 text-[#ea580c] shadow-lg shadow-black/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
            >
                <div
                    onClick={() => onSelect(thread.id)}
                    className="flex-1 flex items-center gap-3 truncate text-left cursor-pointer"
                >
                    <MessageSquare size={14} className={isActive ? 'text-[#ea580c]' : 'text-gray-700 group-hover:text-gray-500'} />

                    {editingThreadId === thread.id ? (
                        <form onSubmit={(e) => handleRenameSubmit(e, thread.id)} className="flex-1">
                            <input
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={(e) => handleRenameSubmit(e, thread.id)}
                                className="w-full bg-black/40 border border-[#ea580c]/30 rounded px-1 text-white outline-none"
                            />
                        </form>
                    ) : (
                        <span className="truncate flex-1 font-medium">{thread.title}</span>
                    )}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
                        className={`p-1 hover:text-white transition-all ${showOptions ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-gray-700'}`}
                    >
                        <MoreVertical size={14} />
                    </button>
                </div>
            </div>

            {showOptions && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
                    <div className="absolute right-0 top-10 z-50 w-48 bg-[#1a1a1a] border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={(e) => { handleRenameStart(e, thread); setShowOptions(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                        >
                            <Edit2 size={14} /> Rename Session
                        </button>

                        <div className="my-1 border-t border-white/5" />

                        <div className="px-3 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Move to Project</div>
                        <button
                            onClick={() => { onMove(thread.id, null); setShowOptions(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${!thread.folderId ? 'text-[#ea580c] bg-[#ea580c]/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <LayoutGrid size={14} /> Inbox / Recent
                        </button>
                        {folders.map(f => (
                            <button
                                key={f.id}
                                onClick={() => { onMove(thread.id, f.id); setShowOptions(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${thread.folderId === f.id ? 'text-[#ea580c] bg-[#ea580c]/5' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <FolderIcon size={14} /> {f.name}
                            </button>
                        ))}

                        <div className="my-1 border-t border-white/5" />

                        <button
                            onClick={() => { onDelete(thread.id); setShowOptions(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all"
                        >
                            <Trash2 size={14} /> Delete Forever
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
