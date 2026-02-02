"use client";

import React, { useState } from 'react';
import { login, getGoogleAuthUrl } from '@/services/aiGatewayService';
import { KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('amr.shah@gmail.com');
    const [password, setPassword] = useState('Password123');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            const url = await getGoogleAuthUrl();
            if (url) {
                window.location.href = url;
            } else {
                setError('Could not initialize Google Auth.');
            }
        } catch (err) {
            setError('Google Auth failed.');
            setIsGoogleLoading(false);
        }
    };

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
                            disabled={isLoading || isGoogleLoading}
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

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-[#0f0f0f] px-2 text-gray-500">Or Continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isGoogleLoading}
                            className={`
                                w-full py-4 rounded-2xl font-bold transition-all border border-white/10 hover:bg-white/5 active:scale-[0.98] flex items-center justify-center gap-3
                                ${isGoogleLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span className="text-white">Corporate Google Account</span>
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
