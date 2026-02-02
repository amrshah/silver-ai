"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleGoogleCallback } from '@/services/aiGatewayService';
import { Loader2 } from 'lucide-react';

export default function GoogleCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processCallback = async () => {
            const query = window.location.search;
            if (!query) {
                setError('No callback parameters found.');
                return;
            }

            try {
                const data = await handleGoogleCallback(query);
                if (data.access_token) {
                    // Redirect to home which will now be authenticated
                    window.location.href = '/';
                } else {
                    setError(data.error || 'Authentication failed');
                }
            } catch (err: any) {
                setError('An error occurred during authentication.');
            }
        };

        processCallback();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl transition-all"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-[#ea580c] animate-spin" />
                <p className="text-[#c4c4c4]/60 font-bold tracking-[0.3em] uppercase text-[10px]">Processing Corporate Secure Login...</p>
            </div>
        </div>
    );
}
