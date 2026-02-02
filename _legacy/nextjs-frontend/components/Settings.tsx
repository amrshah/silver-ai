import React from 'react';
import { Settings as SettingsIcon, Shield, Database, Cpu, Info, Sliders } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSettingsChange({
            ...settings,
            maxTokens: parseInt(e.target.value, 10)
        });
    };

    return (
        <div className="h-full w-full bg-[#0d1117] flex flex-col items-center py-12 px-6 overflow-y-auto">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gray-800 rounded-xl border border-gray-700">
                        <SettingsIcon size={32} className="text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                        <p className="text-gray-400 text-sm">Manage your AI Hub configuration</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Model Parameters */}
                    <section className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80 flex items-center gap-3">
                            <Sliders size={18} className="text-blue-400" />
                            <h2 className="font-semibold text-white">Model Parameters</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-gray-200">
                                        Max Output Tokens
                                    </label>
                                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg text-xs font-mono font-bold">
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
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Short</span>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Balanced</span>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Long Form</span>
                                </div>
                                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                                    Controls the maximum length of the AI's response. Higher values allow for longer, more detailed answers but may increase latency.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* AI Configuration */}
                    <section className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80 flex items-center gap-3">
                            <Cpu size={18} className="text-purple-400" />
                            <h2 className="font-semibold text-white">AI Engine</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-200">Cloudflare AI Gateway</p>
                                    <p className="text-xs text-gray-500 mt-1">Status: <span className="text-green-500 font-semibold uppercase tracking-wider text-[10px]">Active</span></p>
                                </div>
                                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                    <span className="text-green-500 text-[10px] font-bold">CONNECTED</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Active Model</label>
                                <div className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono">
                                    @cf/meta/llama-3.1-8b-instruct
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security */}
                    <section className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80 flex items-center gap-3">
                            <Shield size={18} className="text-blue-400" />
                            <h2 className="font-semibold text-white">Security & Privacy</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-200">API Access Control</p>
                                    <p className="text-xs text-gray-500 mt-1">Enterprise grade encryption enabled</p>
                                </div>
                                <div className="w-10 h-5 bg-blue-600 rounded-full relative flex items-center px-1">
                                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-950/50 border border-gray-800 rounded-xl flex items-start gap-3">
                                <Info size={16} className="text-gray-500 mt-0.5" />
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Your API keys are stored securely and never exposed to the client. All communications are proxied via the Alamia AI Hub for maximum security.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Infrastructure */}
                    <section className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80 flex items-center gap-3">
                            <Database size={18} className="text-orange-400" />
                            <h2 className="font-semibold text-white">Infrastructure</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Gateway ID</p>
                                    <p className="text-xs text-gray-300 font-mono">alamia-ai-hub</p>
                                </div>
                                <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Region</p>
                                    <p className="text-xs text-gray-300 font-mono">Global Edge</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-700">Alamia OS • AI HUB v1.0.4</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
