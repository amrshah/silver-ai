import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Shield,
    Database,
    Cpu,
    Info,
    Sliders,
    Briefcase,
    User,
    Globe,
    Building2,
    Lock,
    UserCircle,
    BookOpen,
    Plus,
    Trash2,
    StickyNote,
    Layers,
    ShieldCheck,
    Globe2,
    Eye,
    EyeOff
} from 'lucide-react';
import { AppSettings, Prompt, AppDefinition, Sender } from '../types';
import { getPrompts, createPrompt, deletePrompt, updateProfile, adminGetApplets, updateApplet, deleteApplet as deleteAppletApi, getApplets, updatePrompt } from '../services/aiGatewayService';

interface SettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
    user: any;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, user }) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [adminApplets, setAdminApplets] = useState<any[]>([]);
    const [userApps, setUserApps] = useState<AppDefinition[]>([]);
    const [showPromptForm, setShowPromptForm] = useState(false);
    const [newPrompt, setNewPrompt] = useState({ title: '', content: '', category: 'General' });
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
    const [editingApplet, setEditingApplet] = useState<any>(null);
    const [editForm, setEditForm] = useState<Partial<AppDefinition>>({});
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
    const [editPromptForm, setEditPromptForm] = useState({ title: '', content: '', category: 'General' });

    useEffect(() => {
        const fetchAll = async () => {
            const pData = await getPrompts();
            setPrompts(pData);

            const aData = await getApplets();
            setUserApps(aData.filter((a: AppDefinition) => !a.isSystem && !a.isGlobal));

            if (user?.is_admin) {
                fetchAdminApplets();
            }
        };
        fetchAll();
    }, [user]);

    const fetchAdminApplets = async () => {
        setIsLoadingAdmin(true);
        try {
            const data = await adminGetApplets();
            setAdminApplets(data);
        } catch (error) {
            console.error("Failed to fetch admin applets");
        }
        setIsLoadingAdmin(false);
    };

    const handleToggleGlobal = async (applet: AppDefinition) => {
        const updated = await updateApplet(applet.id, { is_global: !applet.isGlobal });
        setAdminApplets(adminApplets.map(a => a.id === applet.id ? { ...a, isGlobal: updated.isGlobal } : a));
    };

    const handleTogglePublic = async (applet: AppDefinition) => {
        const updated = await updateApplet(applet.id, { is_public: !applet.isPublic });
        setUserApps(userApps.map(a => a.id === applet.id ? { ...a, isPublic: updated.isPublic } : a));
    };

    const handleDeleteApplet = async (id: number) => {
        if (confirm("Are you sure you want to delete this intelligence applet? This cannot be undone.")) {
            await deleteAppletApi(id);
            setAdminApplets(adminApplets.filter(a => a.id !== id));
            setUserApps(userApps.filter(a => a.id !== id));
        }
    };

    const handleToggleRole = async (appletId: number | string, role: string, currentRoles: any[]) => {
        const roleNames = currentRoles.map(r => r.role_name);
        let newRoles;
        if (roleNames.includes(role)) {
            newRoles = roleNames.filter(r => r !== role);
        } else {
            newRoles = [...roleNames, role];
        }

        const updated = await updateApplet(appletId, { assigned_roles: newRoles });
        setAdminApplets(adminApplets.map(a => a.id === appletId ? { ...a, roles: updated.roles } : a));
    };

    const handleRoleChange = async (role: string) => {
        onSettingsChange({ ...settings, userRole: role });
        await updateProfile({ role });
    };

    const handleConfigChange = (field: keyof AppSettings, value: string) => {
        onSettingsChange({
            ...settings,
            [field]: value
        });
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSettingsChange({
            ...settings,
            maxTokens: parseInt(e.target.value, 10)
        });
    };

    const handleAddPrompt = async () => {
        if (newPrompt.title && newPrompt.content) {
            const data = await createPrompt(newPrompt.title, newPrompt.content, newPrompt.category);
            setPrompts([data, ...prompts]);
            setNewPrompt({ title: '', content: '', category: 'General' });
            setShowPromptForm(false);
        }
    };

    const handleDeletePrompt = async (id: number) => {
        if (!confirm("Delete this strategic prompt template?")) return;
        await deletePrompt(id);
        setPrompts(prompts.filter(p => p.id !== id));
    };

    const handleEditPrompt = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setEditPromptForm({
            title: prompt.title,
            content: prompt.content,
            category: prompt.category || 'General'
        });
    };

    const handleUpdatePrompt = async () => {
        if (!editingPrompt) return;
        const updated = await updatePrompt(editingPrompt.id, editPromptForm);
        setPrompts(prompts.map(p => p.id === editingPrompt.id ? updated : p));
        setEditingPrompt(null);
    };

    const handleEditApplet = (app: any) => {
        setEditingApplet(app);
        setEditForm({
            name: app.name,
            description: app.description,
            systemInstruction: app.systemInstruction || app.system_instruction,
            category: app.category,
            icon: app.icon
        });
    };

    const handleSaveApplet = async () => {
        if (!editingApplet) return;
        const updated = await updateApplet(editingApplet.id, {
            name: editForm.name,
            description: editForm.description,
            system_instruction: editForm.systemInstruction,
            category: editForm.category,
            icon: editForm.icon
        });
        setAdminApplets(adminApplets.map(a => a.id === editingApplet.id ? { ...a, ...updated } : a));
        setEditingApplet(null);
    };

    const roles = [
        'CEO / Founder',
        'Manager Operations',
        'SMM Specialist',
        'PPC Expert',
        'Sales Executive',
        'Business Development',
        'Web Developer',
        'Content Creator',
        'General Executive'
    ];

    return (
        <div className="h-full w-full bg-[#0f0f0f] flex flex-col items-center py-12 px-6 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-3xl">
                <div className="flex items-center gap-5 mb-12">
                    <div className="p-4 bg-white/5 rounded-3xl border border-white/10 shadow-xl">
                        <SettingsIcon size={32} className="text-[#ea580c]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Executive Control</h1>
                        <p className="text-gray-500 font-medium">Manage your identity and intelligence ecosystem</p>
                    </div>
                </div>

                <div className="space-y-8 pb-20">
                    {/* Admin Section */}
                    {user?.is_admin && (
                        <section className="bg-white/5 border border-[#ea580c]/30 rounded-[2rem] overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 right-8 px-3 py-1 bg-[#ea580c] text-white text-[10px] font-bold rounded-b-lg uppercase tracking-widest shadow-lg">System Root</div>
                            <div className="px-8 py-5 border-b border-white/5 bg-[#ea580c]/5 flex items-center gap-3">
                                <ShieldCheck size={18} className="text-[#ea580c]" />
                                <h2 className="font-bold text-white uppercase tracking-widest text-xs">Admin Intelligence Hub</h2>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-gray-400 mb-4 px-1 uppercase tracking-tight">Applet Infrastructure Management</h3>
                                    {isLoadingAdmin ? (
                                        <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-[#ea580c] border-t-transparent rounded-full animate-spin"></div></div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {adminApplets.map(app => (
                                                <div key={app.id} className="p-6 bg-black/40 border border-white/5 rounded-3xl hover:border-white/10 transition-all space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ea580c] shadow-inner">
                                                                <Layers size={24} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white mb-0.5">{app.name}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md">{app.category}</span>
                                                                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${app.isGlobal ? 'bg-[#ea580c]/10 text-[#ea580c]' : 'bg-gray-800 text-gray-500'}`}>
                                                                        {app.isGlobal ? 'Global' : 'Role Restricted'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEditApplet(app)}
                                                                className="p-2.5 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                                                                title="Edit Applet Core"
                                                            >
                                                                <Sliders size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleGlobal(app)}
                                                                className={`p-2.5 rounded-xl transition-all ${app.isGlobal ? 'bg-[#ea580c]/10 text-[#ea580c]' : 'bg-white/5 text-gray-500'} hover:bg-white/10`}
                                                                title={app.isGlobal ? "Remove Global Status" : "Make Global"}
                                                            >
                                                                {app.isGlobal ? <Globe2 size={18} /> : <EyeOff size={18} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteApplet(app.id)}
                                                                className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {editingApplet?.id === app.id && (
                                                        <div className="mt-6 p-6 bg-white/5 rounded-2xl border border-[#ea580c]/20 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">Applet Name</label>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.name}
                                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">Category</label>
                                                                    <input
                                                                        type="text"
                                                                        value={editForm.category}
                                                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">Description</label>
                                                                <input
                                                                    type="text"
                                                                    value={editForm.description}
                                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c]"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">System Intelligence Instructions</label>
                                                                <textarea
                                                                    value={editForm.systemInstruction}
                                                                    onChange={(e) => setEditForm({ ...editForm, systemInstruction: e.target.value })}
                                                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ea580c] resize-none custom-scrollbar"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 pt-2">
                                                                <button
                                                                    onClick={handleSaveApplet}
                                                                    className="flex-1 bg-[#ea580c] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#c2410c] transition-all"
                                                                >
                                                                    Update Intelligence
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingApplet(null)}
                                                                    className="px-6 py-2.5 border border-white/10 text-gray-400 font-bold rounded-xl text-xs hover:bg-white/5"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                                            <Shield size={10} /> Authorized Professional Roles
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {roles.map(role => {
                                                                const isActive = (app.roles || []).some((r: any) =>
                                                                    r.role_name?.toLowerCase().trim() === role.toLowerCase().trim()
                                                                );
                                                                return (
                                                                    <button
                                                                        key={role}
                                                                        onClick={() => handleToggleRole(app.id, role, app.roles || [])}
                                                                        className={`group/role relative px-4 py-2 rounded-xl text-[10px] font-bold transition-all border flex items-center gap-2 ${isActive
                                                                            ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-[0_0_15px_-3px_rgba(234,88,12,0.4)]'
                                                                            : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10 hover:bg-white/10'
                                                                            }`}
                                                                    >
                                                                        {isActive && <ShieldCheck size={10} className="text-white" />}
                                                                        {role}
                                                                        {isActive && (
                                                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* User Profile Section */}
                    <section className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <User size={18} className="text-[#ea580c]" />
                            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Profile Identity</h2>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-black/40 rounded-2xl border border-white/5">
                                <div className="w-20 h-20 rounded-3xl bg-[#ea580c] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="space-y-1 text-center md:text-left flex-1">
                                    <h3 className="text-xl font-bold text-white">{user?.name || 'Executive User'}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{user?.email || 'authenticated'}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-[#ea580c]/10 text-[#ea580c] text-[10px] font-bold rounded-full border border-[#ea580c]/20 uppercase">Pro Elite</span>
                                        {user?.is_admin && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-full border border-purple-500/20 uppercase">Network Admin</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">
                                    <UserCircle size={12} /> Your Executive Role
                                </label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                    {roles.map(role => (
                                        <button
                                            key={role}
                                            disabled={!user?.is_admin}
                                            onClick={() => handleRoleChange(role)}
                                            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${settings.userRole === role ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-lg shadow-[#ea580c]/20' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10 hover:bg-white/10'} ${!user?.is_admin ? 'cursor-default opacity-80' : ''}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                                {!user?.is_admin && <p className="text-[10px] text-[#ea580c]/60 px-1 font-bold uppercase tracking-widest flex items-center gap-1"><Lock size={10} /> Role assignment is managed by network administrators</p>}
                                <p className="text-[10px] text-gray-600 px-1 italic">Elara dynamically adjusts her perspective and lexicon to align with your specific professional role.</p>
                            </div>
                        </div>
                    </section>

                    {/* My Applets Section */}
                    <section className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <Layers size={18} className="text-[#ea580c]" />
                            <h2 className="font-bold text-white uppercase tracking-widest text-xs">My Intelligence Applets</h2>
                        </div>
                        <div className="p-8">
                            <div className="space-y-4">
                                {userApps.length === 0 ? (
                                    <p className="text-center py-6 text-gray-600 text-[10px] font-bold uppercase tracking-widest">No custom applets created yet</p>
                                ) : (
                                    userApps.map(app => (
                                        <div key={app.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                                            <div>
                                                <p className="text-sm font-bold text-white">{app.name}</p>
                                                <p className="text-[10px] text-gray-500">{app.isPublic ? 'Shared with community' : 'Private to you'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleTogglePublic(app)}
                                                    className={`p-2 rounded-lg transition-all ${app.isPublic ? 'bg-[#ea580c]/10 text-[#ea580c]' : 'bg-white/5 text-gray-500'} hover:bg-white/10`}
                                                    title={app.isPublic ? "Make Private" : "Share with community"}
                                                >
                                                    {app.isPublic ? <Globe2 size={14} /> : <EyeOff size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteApplet(Number(app.id))}
                                                    className="p-2 text-gray-600 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Strategic Prompt Library */}
                    <section className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen size={18} className="text-[#ea580c]" />
                                <h2 className="font-bold text-white uppercase tracking-widest text-xs">Strategic Prompt Library</h2>
                            </div>
                            <button
                                onClick={() => setShowPromptForm(!showPromptForm)}
                                className="p-2 bg-[#ea580c] rounded-lg text-white hover:bg-[#c2410c] transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="p-8">
                            {showPromptForm && (
                                <div className="mb-8 p-6 bg-black/40 rounded-2xl border border-[#ea580c]/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Prompt Title (e.g. SEO Audit Framework)"
                                            value={newPrompt.title}
                                            onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <textarea
                                            placeholder="Detailed prompt content..."
                                            value={newPrompt.content}
                                            onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 resize-none custom-scrollbar"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleAddPrompt}
                                            className="flex-1 bg-[#ea580c] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#c2410c] transition-all"
                                        >
                                            Save to Library
                                        </button>
                                        <button
                                            onClick={() => setShowPromptForm(false)}
                                            className="px-6 py-3 border border-white/10 text-gray-400 font-bold rounded-xl text-sm hover:bg-white/5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {prompts.length === 0 ? (
                                    <div className="text-center py-10 px-6 border-2 border-dashed border-white/5 rounded-3xl">
                                        <StickyNote size={40} className="text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">Your library is empty.</p>
                                        <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">Store recurring prompts for instant access</p>
                                    </div>
                                ) : (
                                    prompts.map(prompt => (
                                        <div key={prompt.id} className="group p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-[#ea580c]/30 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-extrabold text-[#ea580c] text-sm tracking-tight">{prompt.title}</h3>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => handleEditPrompt(prompt)}
                                                        className="p-1.5 text-gray-600 hover:text-[#ea580c] transition-all"
                                                        title="Edit Template"
                                                    >
                                                        <Sliders size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePrompt(prompt.id)}
                                                        className="p-1.5 text-gray-600 hover:text-red-500 transition-all"
                                                        title="Delete Template"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {editingPrompt?.id === prompt.id ? (
                                                <div className="mt-4 space-y-3 p-4 bg-white/5 rounded-xl border border-[#ea580c]/20">
                                                    <input
                                                        type="text"
                                                        value={editPromptForm.title}
                                                        onChange={(e) => setEditPromptForm({ ...editPromptForm, title: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                                                    />
                                                    <textarea
                                                        value={editPromptForm.content}
                                                        onChange={(e) => setEditPromptForm({ ...editPromptForm, content: e.target.value })}
                                                        className="w-full h-24 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none custom-scrollbar"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleUpdatePrompt}
                                                            className="flex-1 bg-[#ea580c] text-white font-bold py-2 rounded-lg text-[10px] hover:bg-[#c2410c]"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingPrompt(null)}
                                                            className="px-4 py-2 border border-white/10 text-gray-400 font-bold rounded-lg text-[10px] hover:bg-white/5"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">{prompt.content}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Global Configuration Section */}
                    <section className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <Briefcase size={18} className="text-[#ea580c]" />
                            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Business Intelligence Context</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">
                                        <Building2 size={12} /> Business Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.businessName || ''}
                                        onChange={(e) => handleConfigChange('businessName', e.target.value)}
                                        placeholder="e.g. Silver Ant Marketing"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 placeholder-gray-800 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">
                                        <Globe size={12} /> Industry Vertical
                                    </label>
                                    <select
                                        value={settings.industry || 'General'}
                                        onChange={(e) => handleConfigChange('industry', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 appearance-none transition-all font-bold cursor-pointer"
                                    >
                                        <option value="General">General / Other</option>
                                        <option value="Marketing">Marketing & Advertising</option>
                                        <option value="Finance">Finance & Fintech</option>
                                        <option value="Tech">Technology / Software</option>
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Education">Education</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-1">Global Context (Always provided to AI)</label>
                                <textarea
                                    value={settings.globalContext || ''}
                                    onChange={(e) => handleConfigChange('globalContext', e.target.value)}
                                    placeholder="Provide high-level context about your business operations, goals, or preferred communication style."
                                    className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 placeholder-gray-800 resize-none transition-all font-medium leading-relaxed custom-scrollbar"
                                />
                                <p className="text-[10px] text-gray-600 mt-2 px-1">This context is automatically injected into every Elara session to ensure brand alignment.</p>
                            </div>
                        </div>
                    </section>

                    {/* Linguistic Core */}
                    <section className="bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <Sliders size={18} className="text-[#ea580c]" />
                            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Linguistic Core</h2>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-sm font-bold text-gray-300">
                                    Max Response Horizon (Tokens)
                                </label>
                                <span className="px-4 py-1.5 bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20 rounded-full text-xs font-mono font-bold">
                                    {settings.maxTokens}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="256"
                                max="8192"
                                step="256"
                                value={settings.maxTokens}
                                onChange={handleTokenChange}
                                className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#ea580c]"
                            />
                            <div className="flex justify-between mt-4">
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Concise</span>
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Standard</span>
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Comprehensive</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="text-center py-12">
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-700">
                        Silver AI • Elara Intelligence Suite v2.1.0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
