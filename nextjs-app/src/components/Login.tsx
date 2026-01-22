"use client";

import React, { useState } from 'react';
import { login } from '@/services/aiGatewayService';
import { KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('amr.shah@gmail.com');
    const [password, setPassword] = useState('Password123');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await login(email, password);
            if (data.access_token) {
                onLoginSuccess(data.user);
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err: any) {
            setError('Failed to connect to the backend.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <img
                        src="https://silverantmarketing.com/wp-content/uploads/2021/06/header-light-logo-sam.webp"
                        alt="Silver AI Logo"
                        className="h-16 w-auto mx-auto mb-6 object-contain"
                    />
                    <h1 className="text-4xl font-extrabold text-[#c4c4c4] mb-3 tracking-tight">Silver AI</h1>
                    <p className="text-gray-400 font-medium">Access Elara Intelligence Suite</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Executive Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ea580c] transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0f0f0f]/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-transparent transition-all font-medium"
                                    placeholder="name@silverant.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Access Key</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#ea580c] transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0f0f0f]/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#ea580c]/20 focus:border-transparent transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98]
                ${isLoading ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-[#ea580c] text-white hover:bg-[#c2410c]'}
              `}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying...</span>
                                </div>
                            ) : 'Initialize Suite'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">
                            Private Intelligence Network
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
