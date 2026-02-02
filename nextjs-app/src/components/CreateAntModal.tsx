"use client";

import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { AntDefinition } from '../types';
import IconPicker from './IconPicker';
import IconRenderer from './IconRenderer';
import { askChat } from '../services/aiGatewayService';

interface CreateAntModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (ant: AntDefinition) => void;
    isAdmin?: boolean;
}

const CreateAntModal: React.FC<CreateAntModalProps> = ({ isOpen, onClose, onCreate, isAdmin }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [instruction, setInstruction] = useState('');
    const [icon, setIcon] = useState('Sparkles');
    const [isGlobal, setIsGlobal] = useState(false);
    const [isSystem, setIsSystem] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [isImproving, setIsImproving] = useState(false);

    if (!isOpen) return null;

    const handleImprovePrompt = async () => {
        if (!instruction.trim() || isImproving) return;

        setIsImproving(true);
        try {
            const prompt = `Refine and improve this standard AI system instruction to be more professional, precise, and effective. Return ONLY the improved instruction text: "${instruction}"`;
            const improved = await askChat(prompt);
            setInstruction(improved.trim());
        } catch (error) {
            console.error("Failed to improve prompt:", error);
        } finally {
            setIsImproving(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !instruction) return;

        const newAnt: AntDefinition = {
            id: `user-${Date.now()}`,
            name,
            description,
            systemInstruction: instruction,
            icon,
            isSystem: isSystem,
            isGlobal: isGlobal,
            category: 'general'
        };

        onCreate(newAnt);
        onClose();
        // Reset form
        setName('');
        setDescription('');
        setInstruction('');
        setIcon('Sparkles');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Create AI Ant</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowIconPicker(!showIconPicker)}
                                className="w-20 h-20 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-[#ea580c] hover:border-[#ea580c]/50 hover:bg-white/10 transition-all shadow-inner group"
                            >
                                <IconRenderer name={icon} size={32} />
                                <div className="absolute -bottom-2 -right-2 bg-white/10 rounded-full p-1 border border-white/10 group-hover:scale-110 transition-transform">
                                    <Sparkles size={12} className="text-[#ea580c]" />
                                </div>
                            </button>

                            {showIconPicker && (
                                <div className="absolute top-22 left-1/2 -translate-x-1/2 z-50">
                                    <IconPicker
                                        currentIcon={icon}
                                        onSelect={setIcon}
                                        onClose={() => setShowIconPicker(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Ant Identity</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., SEO Architect"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-transparent placeholder-gray-700 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Scope & Mission</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe its operational goal"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-transparent placeholder-gray-700 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Neural Instructions</label>
                            <button
                                type="button"
                                onClick={handleImprovePrompt}
                                disabled={!instruction.trim() || isImproving}
                                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full border transition-all ${instruction.trim() && !isImproving
                                    ? 'border-[#ea580c]/30 text-[#ea580c] hover:bg-[#ea580c]/10'
                                    : 'border-white/5 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                {isImproving ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" />
                                        Refining...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={12} />
                                        Improve with AI
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            placeholder="Define the AI's core behavior, constraints, and expertise level..."
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-transparent placeholder-gray-700 resize-none transition-all font-medium leading-relaxed custom-scrollbar"
                            required
                        />
                    </div>

                    {isAdmin && (
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                            <label className="block text-xs font-bold text-[#ea580c] uppercase tracking-widest px-1">Administrative Privileges</label>
                            <div className="flex gap-4">
                                <label className="flex-1 flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl cursor-pointer hover:bg-black/60 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={isGlobal}
                                        onChange={(e) => setIsGlobal(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-[#ea580c] focus:ring-[#ea580c]/50"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white uppercase">Global Ant</span>
                                        <span className="text-[10px] text-gray-500">Available to all users</span>
                                    </div>
                                </label>
                                <label className="flex-1 flex items-center gap-3 p-3 bg-black/40 border border-white/5 rounded-xl cursor-pointer hover:bg-black/60 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={isSystem}
                                        onChange={(e) => setIsSystem(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-[#ea580c] focus:ring-[#ea580c]/50"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white uppercase">System Ant</span>
                                        <span className="text-[10px] text-gray-500">Core platform ant</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] tracking-tight text-lg"
                        >
                            Deploy Ant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAntModal;
